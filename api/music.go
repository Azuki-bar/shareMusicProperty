package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2/clientcredentials"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
)

type musicMeta struct {
	url            *url.URL
	title          string
	albumName      string
	artists        []spotify.SimpleArtist
	isArtistsGroup bool
	isLink         bool
	isJson         bool
	id             spotify.ID
}
type tweet struct {
	textContent string
	url         *url.URL
	maxLength   int
	urlLength   int
}
type musicMetaJson struct {
	TextContent    string   `json:"text_content"`
	Title          string   `json:"title"`
	AlbumName      string   `json:"album_name"`
	ArtistsName    []string `json:"artists"`
	Url            string   `json:"url"`
	TweetIntentUrl string   `json:"tweet_intent_url"`
}

func (mmj *musicMetaJson) addStruct(t tweet, mm musicMeta) {
	mmj.TextContent = t.textContent
	mmj.Url = t.url.String()
	mmj.Title = mm.title
	mmj.AlbumName = mm.albumName
	for _, artist := range mm.artists {
		mmj.ArtistsName = append(mmj.ArtistsName, artist.Name)
	}
	mmj.TweetIntentUrl = t.makeTweetIntent()
}
func countTwitterCharacters(s string) int {
	strLen := 0
	ss := strings.Split(s, "")
	for _, v := range ss {
		if len(v) > 1 {
			strLen += 2
		} else {
			strLen += 1
		}
	}
	return strLen
}
func getHtmlTemplate() string {
	text := `<!DOCTYPE html>
<html lang="jp">
<head>
<meta charset="UTF-8">
<title>Azukibar Spotify Music API</title>
</head>
<a href="{{ .Url }}">{{ .Context }}</a> 
</html>
`
	return text
}
func (t *tweet) concreteStrUrl() string {
	return t.textContent + t.url.String()
}
func Handler(w http.ResponseWriter, r *http.Request) {
	t := tweet{
		textContent: "",
		url:         nil,
		maxLength:   280,
		urlLength:   23,
	}
	mm := musicMeta{
		url:            nil,
		title:          "",
		albumName:      "",
		artists:        nil,
		isArtistsGroup: false,
		id:             "",
	}
	err := mm.getMusicMeta(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	} else {
		mm.makeTweetString(&t)
		if mm.isLink {
			hyperLinkElems := struct {
				Url     string
				Context string
			}{
				Url:     mm.url.String(),
				Context: t.textContent,
			}
			tpl, err := template.New("").Parse(getHtmlTemplate())
			if err != nil {
				log.Fatal(err)
			}
			err = tpl.Execute(w, hyperLinkElems)
			if err != nil {
				log.Fatal(err)
			}
		} else if mm.isJson {
			mmj := musicMetaJson{}
			mmj.addStruct(t, mm)
			b, err := json.Marshal(mmj)
			if err != nil {
				log.Fatal(err)
			}
			_, err = w.Write(b)
			if err != nil {
				log.Fatal(err)
			}
		} else {
			_, err = fmt.Fprintf(w, "%s", t.makeTweetIntent())
		}
		if err != nil {
			log.Fatal(err)
		}
	}
}

func (mm *musicMeta) parseRequestUri(r *http.Request) {
	userUrl := r.URL.Query().Get("url")
	mm.isLink = r.URL.Query().Get("link") == "true"
	mm.isJson = r.URL.Query().Get("isJson") == "true"
	u, err := url.Parse(userUrl)
	if err != nil {
		log.Fatal(err)
	}
	// ?url=https://open.spotify.com/track/44VFbGPyQDEkYLOKUdRaRj?si=e067ad6ba13c40d5?isJson=true
	mm.url = u
	mm.id = spotify.ID(strings.Replace(u.Path, "/track/", "", -1))
}
func (mm *musicMeta) getMusicMeta(r *http.Request) error {
	config := &clientcredentials.Config{
		ClientID:     os.Getenv("SPOTIFY_ID"),
		ClientSecret: os.Getenv("SPOTIFY_SECRET"),
		TokenURL:     spotify.TokenURL,
	}
	token, err := config.Token(context.Background())
	if err != nil {
		return err
	}
	client := spotify.Authenticator{}.NewClient(token)
	mm.parseRequestUri(r)
	c := "JP"
	track, err := client.GetTrackOpt(mm.id, &(spotify.Options{Country: &c}))
	if err != nil || track == nil {
		return err
	}
	mm.title = track.Name
	mm.albumName = track.Album.Name
	mm.artists = track.Artists
	if len(mm.artists) > 1 {
		mm.isArtistsGroup = true
	}
	return nil
}

func (mm musicMeta) concreteArtists(maxLength int) (string, int) {
	artistsNames := ""
	maxArtists := 0
	for i, v := range mm.artists {
		if countTwitterCharacters(artistsNames+v.Name+", "+" など") > maxLength-1 {
			if maxArtists == 0 {
				log.Fatal(fmt.Sprintf("failed to concrete artists names : %s", mm.artists))
			}
			break
		}
		artistsNames = artistsNames + v.Name + ", "
		maxArtists = i + 1
	}
	return strings.TrimSuffix(artistsNames, ", "), maxArtists
}

func (mm *musicMeta) makeTweetString(t *tweet) {
	stringMaxLength := t.maxLength - t.urlLength
	if mm.title == "" || mm.albumName == "" {
		log.Fatalf("meta data is not corrected")
	}
	maxLength := stringMaxLength - countTwitterCharacters(fmt.Sprintf("おすすめの曲… %s by ", mm.title))
	artistsName, n := mm.concreteArtists(maxLength)
	isOverFlowArtists := !(len(mm.artists) == n)
	content := "おすすめの曲… " + mm.title + " by " + artistsName
	if isOverFlowArtists {
		content += " など"
	}
	t.textContent = content
	t.url = mm.url
}
func (t *tweet) makeTweetIntent() string {
	intentPrefix := "https://twitter.com/intent/tweet"
	u, err := url.Parse(intentPrefix)
	if err != nil {
		log.Fatal(err)
	}
	q := u.Query()
	q.Set("url", t.url.String())
	q.Set("text", t.textContent)
	u.RawQuery = q.Encode()
	return u.String()
}

/*
func main() {
	http.HandleFunc("/", Handler)
	http.ListenAndServe(":3000", nil)
}
*/
