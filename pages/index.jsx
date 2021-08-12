import React, {useState} from "react";
import {UrlForm} from "../component/urlForm";
import {PageDesign} from "../component/pageDesign";

const HomePage = () => {
  const [pageTitle, setPageTitle] = useState("聞いている曲を共有")
  return (
    <div>
      <PageDesign title={pageTitle}>
        <div className={"content"}>
          <UrlForm service="Spotify" titleSetter={setPageTitle}/>
        </div>
      </PageDesign>
    </div>
  )
}
export default HomePage