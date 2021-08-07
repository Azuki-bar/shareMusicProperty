import React from "react";
import {UrlForm} from "../component/urlForm";
import {PageDesign} from "../component/pageDesign";

const HomePage = () => {
  return (
    <div>
      <PageDesign title={"曲名取得"}>
        <div className={"content"}>
          <UrlForm service="Spotify"/>
        </div>
      </PageDesign>
    </div>
  )
}
export default HomePage