import {NavBar} from "./navBar";
import {HeadTag} from "./headTag";
import {Footer} from "./footer";

export const PageDesign = (props) => {
  const stickyFooterStyle = {
    minHeight: "100vh",
    display: "grid",
    gridTemplateRows: "auto 1fr auto"
  }

  return (
    <div>
      <HeadTag title={props.title}/>
      <div className="wrapper" style={stickyFooterStyle}>
        <NavBar/>
        <main>
          <div className="container">
            {props.children}
          </div>
        </main>
        <Footer/>
      </div>
    </div>
  )
}