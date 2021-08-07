import {NavBar} from "./navBar";
import {HeadTag} from "./headTag";
import {Footer} from "./footer";

export const PageDesign = (props) => {

  return (
    <div>
      <HeadTag title={props.title}/>
      <NavBar/>
      <main>
        <div className="container">
          {props.children}
        </div>
      </main>
      <Footer/>
    </div>
  )
}