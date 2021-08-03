import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useState} from "react"

async function getSpotifyApi(url) {
  const baseUrl = "/api/song";
  const queryParams = new URLSearchParams({
    "url": url,
    "isJson": true
  })
  const response = await fetch(`${baseUrl}?${queryParams}`, {method: "GET"})
  const requestRes = await response.json()
}

export const UrlForm = (props) => {
  const [isUrlShow, setIsUrlShow] = useState(false)
  const [inputUrl, setInputUrl] = useState("")

  function getApiReq(props) {
    setInputUrl(props.target.value)
    if (props.target.value.length >= 3) {
      setIsUrlShow(true)
    } else {
      setIsUrlShow(false)
    }
  }

  return (
    <form action={"/api/song"} method={"get"}>
      <div className="field">
        <label className="label has-text-centered">{props.service + " Share Link"}</label>
        <div className="control">
          <input value={inputUrl} className="input" type="text" name={"url"}
                 onChange={getApiReq}
                 placeholder={"please input " + props.service + " URL"}/>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button className={"button is-link has-text-centered"}>Get Share Link</button>
        </div>
      </div>
      <div id={"urlShow"} className={"" + isUrlShow ? " is-hidden" : ""}>

      </div>
    </form>
  )
}