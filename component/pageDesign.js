import {NavBar} from "./navBar";
import {HeadTag} from "./headTag";
import {Footer} from "./footer";

export const PageDesign = (props) => {

  return (
    <div>
      <HeadTag title={props.title}/>
      <NavBar/>
      <div className="columns">
        <div className="column">
          <main>
            {props.children}
          </main>
        </div>
        <div className="column">
          hoge
        </div>
      </div>
      <Footer/>
    </div>
  )
}