import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTwitter} from "@fortawesome/free-brands-svg-icons";

export const ShowMusicMeta = (props) => {
  const musicMeta = props.musicmeta;
  const Artist = (props) => {
    return (
      <li key={props.name} className="is-center">
        {props.name}
      </li>
    )
  }
  return (
    <div id={"share links"} className="columns block">
      <div id={'MusicName'} className="column is-block is-text is-center">
        <div className="columns">
          <div className="column is-offset-one-fifth">
            曲名
          </div>
        </div>
        {musicMeta.title}
      </div>
      <div id={"artists"} className="column is block is-text is-center">
        <div className="columns">
          <div className="column is-offset-one-fifth">
            アーティスト
          </div>
        </div>
        {
          musicMeta.artists.map((name) => {
            return <Artist name={name}/>
          })
        }
      </div>
      <div id="shareLink" className="column is-block">
        <button className="button is-link has-text-centered"
                onClick={() => {
                  location.assign(musicMeta.tweet_intent_url)
                }}>
          この曲をTwitterで共有
          <FontAwesomeIcon icon={faTwitter}/>
        </button>
      </div>
    </div>
  )
}