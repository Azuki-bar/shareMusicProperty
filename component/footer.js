import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faGithubAlt, faGithubSquare} from "@fortawesome/free-brands-svg-icons";
import Link from 'next/link'

export const Footer = (props) => {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <div className="github block">
          <a target="_blank" href="https://github.azukibar.dev">
            <button className="button">
              <FontAwesomeIcon icon={faGithub}/>
              GitHub
            </button>
          </a>
        </div>
        <div className="bulma_icon block">
          <a target="_blank" href="https://bulma.io">
            <img src="https://bulma.io/images/made-with-bulma.png" alt="Made with Bulma" width="128" height="24"/>
          </a>
        </div>
      </div>
    </footer>
  )
}
