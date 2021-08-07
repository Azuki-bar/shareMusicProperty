import {useState} from "react"
import throttle from 'lodash/throttle'
import {Showmusicmeta} from "./showmusicmeta";

export const initMusicMeta = {
  "text_content": "",
  "title": "",
  "album_name": "",
  "artists": [],
  "url": "",
  "tweet_intent_url": ""
}

export const UrlForm = (props) => {

  const [isUrlShow, setIsUrlShow] = useState(false)
  const [inputUrl, setInputUrl] = useState("")
  const [musicMeta, setMusicMeta] = useState(initMusicMeta)

  function getApiReq(event) {
    event.preventDefault();
    const spotifyUrlPattern = new RegExp(/^https:\/\/open\.spotify\.com\/track\/([0-9A-Za-z]{22})(\?.+|)/)
    // https://www.wikidata.org/wiki/Property:P2207

    // setInputUrl(event.target.value)
    let tmpIsUrlShow = false;
    if (spotifyUrlPattern.test(inputUrl)) {
      console.log("TEST passed")
      getSpotifyApi(event)
        .then(() => {
          if (musicMeta.title.length !== 0) {
            tmpIsUrlShow = true;
          }
        })
    }
    if (!tmpIsUrlShow) {
      setMusicMeta(initMusicMeta)
    }
    setIsUrlShow(tmpIsUrlShow)
  }

  async function getSpotifyApi(event) {
    const baseUrl = "/api/music";
    const queryParams = new URLSearchParams({
      "url": inputUrl,
      "isJson": "true"
    })
    if (inputUrl === "") {
    } else {
      const response = fetch(`${baseUrl}?${queryParams}`, {method: "GET"})
        .then(response => response.json())
        .then(jsonData => {
            console.log(jsonData);
            setMusicMeta(jsonData)
            setIsUrlShow(true)
          },
          (err) => {
            console.log("ERR", err);
            setMusicMeta(initMusicMeta);
          }
        )
    }
  }

  function getSpotifyApiThrottle(props) {
    throttle(getSpotifyApi, 100)
  }

  return (
    <div>
      < form onSubmit={getApiReq}>
        {/*<form action={musicMeta.title.length === 0 ? "/" : musicMeta.tweet_intent_url} method={"get"}*/}
        {/*      onSubmit={getApiReq}>*/}
        <div className="field">
          <label className="label has-text-centered">{props.service + " Share Link"}</label>
          {/*<div className="control">*/}
          <input value={inputUrl} className="input" type="text" name={"url"}
            // onInput={getApiReq}
                 onInput={(e) => setInputUrl(e.target.value)}
                 placeholder={"please input " + props.service + " URL"}/>
          {/*</div>*/}
          <button className="button" onClick={getApiReq} type="submit">
            Create Link
          </button>
        </div>
      </form>
      <div className="field">
        <div id={"urlShow"} className={"" + isUrlShow ? "" : " is-hidden"}
             style={{display: isUrlShow ? "block" : "none"}}>
          <Showmusicmeta musicmeta={musicMeta}/>
        </div>
      </div>
    </div>
  )
}