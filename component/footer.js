import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub,} from "@fortawesome/free-brands-svg-icons";
import Link from 'next/link'

export const Footer = (props) => {
  return (
    <footer className="footer" style={{position: "absolute", width: "100%", bottom: 0, overflow: "hidden"}}>
      <div className="content has-text-centered">
        <div className="github block">
          <Link href={"https://github.azukibar.dev"}>
            <a target="_blank">
              <button className="button">
                <FontAwesomeIcon icon={faGithub}/>
                GitHub
              </button>
            </a>
          </Link>
        </div>
        <div className="bulma_icon block">
          <Link href="https://bulma.io">
            <a target="_blank">
              <img src="https://bulma.io/images/made-with-bulma.png" alt="Made with Bulma" width="128" height="24"/>
            </a>
          </Link>
        </div>
      </div>
    </footer>
  )
}
