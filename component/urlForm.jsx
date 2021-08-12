import {useState} from "react"
import throttle from 'lodash/throttle'
import {ShowMusicMeta} from "./showMusicMeta";
import {defaultTitle} from "../pages";

export const initMusicMeta = {
  "text_content": "",
  "title": "",
  "album_name": "",
  "artists": [],
  "url": "",
  "tweet_intent_url": ""
}

export const UrlForm = (props) => {

  const ButtonStatus = {
    "SUCCESS": "success",
    "LOADING": "loading",
    "FAILED": "failed",
    "CHECK_URL": "CheckUrl",
    "INIT_STATUS": ""
  }

  const [isUrlShow, setIsUrlShow] = useState(false)
  const [inputUrl, setInputUrl] = useState("")
  const [musicMeta, setMusicMeta] = useState(initMusicMeta)
  const [sendButtonStatus, setSendButtonStatus] = useState(ButtonStatus.INIT_STATUS)
  const setDocumentTitle = props.titleSetter

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
    } else {
      setSendButtonStatus(ButtonStatus.CHECK_URL)
      setTimeout(() => {
        setSendButtonStatus(ButtonStatus.INIT_STATUS)
      }, 1500)
    }
    if (!tmpIsUrlShow) {
      setMusicMeta(initMusicMeta)
    }
    setIsUrlShow(tmpIsUrlShow)
  }

  async function getSpotifyApi(event) {
    setSendButtonStatus(ButtonStatus.LOADING)
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
            setSendButtonStatus(ButtonStatus.SUCCESS)
            setDocumentTitle(jsonData.title + " をTwitterで共有")
          },
          (err) => {
            console.log("ERR", err);
            setMusicMeta(initMusicMeta);
            setSendButtonStatus(ButtonStatus.FAILED)
            setDocumentTitle(defaultTitle)
          }
        ).then(
          () => {
            setTimeout(() => {
              setSendButtonStatus(ButtonStatus.INIT_STATUS)
            }, 1500)
          }
        )
    }
  }

  function getSpotifyApiThrottle(props) {
    throttle(getSpotifyApi, 100)
  }

  function changeSendButton() {
    switch (sendButtonStatus) {
      case ButtonStatus.LOADING:
        return " is-loading"
      case ButtonStatus.SUCCESS:
        return " is-success"
      case ButtonStatus.FAILED:
      case ButtonStatus.CHECK_URL:
        return " is-danger"
      case ButtonStatus.INIT_STATUS:
      default:
        return ""
    }
  }

  function sendButtonMessage() {
    switch (sendButtonStatus) {
      case ButtonStatus.LOADING:
        return "Creating..."
      case ButtonStatus.SUCCESS:
        return "Success!"
      case ButtonStatus.FAILED:
        return "Failed......"
      case ButtonStatus.CHECK_URL:
        return "Please Check URL"
      case ButtonStatus.INIT_STATUS:
      default:
        return "Create Link"
    }

  }

  return (
    <div>
      < form onSubmit={getApiReq}>
        <div className="field">
          <div className="block">
            <label className="label has-text-centered">{props.service + " Share Link"}</label>
            <input value={inputUrl} className="input" type="text" name={"url"}
                   onInput={(e) => setInputUrl(e.target.value)}
                   placeholder={"please input " + props.service + " URL"} autoComplete="off"/>
          </div>

          <div className="block">
            <div className="buttons is-centered">

              <button className={"button" + changeSendButton()} onClick={getApiReq} type="submit">
                {sendButtonMessage()}
              </button>

              <button className="button is-danger is-small is-outlined"
                      onClick={(e) => {
                        e.preventDefault();
                        setInputUrl("");
                        setIsUrlShow(false);
                        setDocumentTitle(defaultTitle)
                      }}
              >
                reset Form
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="field">
        <div id={"urlShow"} className={"" + isUrlShow ? "" : " is-hidden"}
             style={{display: isUrlShow ? "block" : "none"}}>
          <ShowMusicMeta musicmeta={musicMeta}/>
        </div>
      </div>
    </div>
  )
}
