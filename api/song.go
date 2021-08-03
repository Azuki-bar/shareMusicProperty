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
	"unicode/utf8"
)

type songMeta struct {
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
type SongMetaJson struct {
	TextContent    string   `json:"text_content"`
	Title          string   `json:"title"`
	AlbumName      string   `json:"album_name"`
	ArtistsName    []string `json:"artists"`
	Url            string   `json:"url"`
	TweetIntentUrl string   `json:"tweet_intent_url"`
}

func (smj *SongMetaJson) addStruct(t tweet, sm songMeta) {
	smj.TextContent = t.textContent
	smj.Url = t.url.String()
	smj.Title = sm.title
	smj.AlbumName = sm.albumName
	for _, artist := range sm.artists {
		smj.ArtistsName = append(smj.ArtistsName, artist.Name)
	}
	smj.TweetIntentUrl = t.makeTweetIntent()
}

func getHtmlTemplate() string {
	text := `<!DOCTYPE html>
<html lang="jp">
<head>
<meta charset="UTF-8">
<title>Azukibar Song API</title>
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
		maxLength:   140,
		urlLength:   23,
	}
	sm := songMeta{
		url:            nil,
		title:          "",
		albumName:      "",
		artists:        nil,
		isArtistsGroup: false,
		id:             "",
	}
	err := sm.getSongMeta(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	} else {
		sm.makeTweetString(&t)
		if sm.isLink {
			hyperLinkElems := struct {
				Url     string
				Context string
			}{
				Url:     sm.url.String(),
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
		} else if sm.isJson {
			smj := SongMetaJson{}
			smj.addStruct(t, sm)
			b, err := json.Marshal(smj)
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

func (sm *songMeta) parseRequestUri(r *http.Request) {
	userUrl := r.URL.Query().Get("url")
	sm.isLink = r.URL.Query().Get("link") == "true"
	sm.isJson = r.URL.Query().Get("isJson") == "true"
	u, err := url.Parse(userUrl)
	if err != nil {
		log.Fatal(err)
	}
	// ?url=https://open.spotify.com/track/44VFbGPyQDEkYLOKUdRaRj?si=e067ad6ba13c40d5?isJson=true
	sm.url = u
	sm.id = spotify.ID(strings.Replace(u.Path, "/track/", "", -1))
}
func (sm *songMeta) getSongMeta(r *http.Request) error {
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
	sm.parseRequestUri(r)
	track, err := client.GetTrack(sm.id)
	if err != nil || track == nil {
		return err
	}
	sm.title = track.Name
	sm.albumName = track.Album.Name
	sm.artists = track.Artists
	if len(sm.artists) > 1 {
		sm.isArtistsGroup = true
	}
	return nil
}

func (sm songMeta) concreteArtists(maxLength int) (string, int) {
	artistsNames := ""
	maxArtists := 0
	for i, v := range sm.artists {
		if utf8.RuneCountInString(artistsNames+v.Name+", ") > maxLength-1 {
			if maxArtists == 0 {
				log.Fatal(fmt.Sprintf("failed to concrete artists names : %s", sm.artists))
			}
			break
		}
		artistsNames = artistsNames + v.Name + ", "
		maxArtists = i + 1
	}
	if maxArtists > 1 {
		return strings.TrimSuffix(artistsNames, ", "), maxArtists
	} else {
		return artistsNames, maxArtists
	}
}

func (sm *songMeta) makeTweetString(t *tweet) {
	stringMaxLength := t.maxLength - t.urlLength
	if sm.title == "" || sm.albumName == "" {
		log.Fatalf("meta data is not corrected")
	}
	maxLength := stringMaxLength - utf8.RuneCountInString(fmt.Sprintf("おすすめの曲… %s by ", sm.title))
	artistsName := ""
	if sm.isArtistsGroup {
		artistsName, _ = sm.concreteArtists(maxLength)
	} else {
		artistsName = sm.artists[0].Name
	}
	content := "おすすめの曲… " + sm.title + " by " + artistsName + " "
	t.textContent = content
	t.url = sm.url
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
