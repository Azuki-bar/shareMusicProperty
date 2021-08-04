import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useState} from "react"
import {faTwitter} from "@fortawesome/free-brands-svg-icons";
import throttle from 'lodash/throttle'
import Link from "next/link";

export const UrlForm = (props) => {
  const [isUrlShow, setIsUrlShow] = useState(false)
  const [inputUrl, setInputUrl] = useState("")
  const [musicMeta, setMusicMeta] = useState(
    {
      "text_content": "",
      "title": "",
      "album_name": "",
      "artists": [],
      "url": "",
      "tweet_intent_url": ""
    }
  )

  function getApiReq(props) {
    const spotifyUrlPattern = new RegExp(/https:\/\/open.spotify.com\/track\/.+/)
    setInputUrl(props.target.value)
    let tmpIsUrlShow = false;
    if (spotifyUrlPattern.test(props.target.value)) {
      getSpotifyApi(props).then()
      if (musicMeta.title.length !== 0) {
        tmpIsUrlShow = true;
      }
      setIsUrlShow(tmpIsUrlShow)
    }
  }

  async function getSpotifyApi(props) {
    const baseUrl = "/api/music";
    const queryParams = new URLSearchParams({
      "url": inputUrl,
      "isJson": true
    })
    const response = await fetch(`${baseUrl}?${queryParams}`, {method: "GET"})
    const requestRes = await response.json()
    setMusicMeta(requestRes)
    console.log(musicMeta)
  }

  function getSpotifyApiThrottle(props) {
    throttle(getSpotifyApi, 100)
  }

  return (
    <div>
      <form action={musicMeta.title.length === 0 ? "/" : musicMeta.tweet_intent_url} method={"get"}
            onSubmit={musicMeta.title.length === 0 ? (e) => e.preventDefault() : null}>
        <div className="field">
          <label className="label has-text-centered">{props.service + " Share Link"}</label>
          <div className="control">
            <input value={inputUrl} className="input" type="text" name={"url"}
                   onInput={getApiReq}
                   placeholder={"please input " + props.service + " URL"}/>
          </div>
        </div>
      </form>
      <div className="field">
        <div id={"urlShow"} className={"" + isUrlShow ? "" : " is-hidden"}
             style={{display: isUrlShow ? "block" : "none"}}>
          <div id={"share links"} className="columns block">
            <div id={'MusicName'} className="column is-block is-text is-center">
              曲名:{musicMeta.title}
            </div>
            <div id="shareLink" className="column is-block">
              <Link href={musicMeta.tweet_intent_url}>
                <a>
                  <button className="button is-link has-text-centered">この曲をTwitterで共有
                    <FontAwesomeIcon icon={faTwitter}/>
                  </button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}