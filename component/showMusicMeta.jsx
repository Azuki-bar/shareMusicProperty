import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTwitter} from "@fortawesome/free-brands-svg-icons";

export const ShowMusicMeta = (props) => {
  const musicMeta = props.musicmeta;
  const Artist = (props) => {
    return (
      <div key={props.name} className="box">
        {props.name}
      </div>
    )
  }
  const PropertyHeader = (props) => {
    return (
      <div className="is-text has-text-centered">
        <h5 className="">
          {props.title}
        </h5>
      </div>
    )
  }
  const Property = (props) => {
    return (
      <div id={props.id} className="column is-block is-text is-center has-text-centered">
        <PropertyHeader title={props.headerTitle}/>
        {props.children}
      </div>
    )
  }
  return (
    <div id={"share links"} className="columns block">
      <Property id="musicName" headerTitle="曲名">
        <Artist name={musicMeta.title}/>
      </Property>
      <Property id="artists" headerTitle="アーティスト">
        {
          musicMeta.artists.map((name) => {
            return <Artist name={name}/>
          })
        }
      </Property>
      <Property id="shareLink" headerTitle="共有リンク">
        <button className="button is-link has-text-centered"
                onClick={() => {
                  location.assign(musicMeta.tweet_intent_url)
                }}>
          この曲を Twitter で共有
          <FontAwesomeIcon icon={faTwitter}/>
        </button>
      </Property>
    </div>
  )
}