import Link from "next/link";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTwitter} from "@fortawesome/free-brands-svg-icons";

export const NavBar = (props) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false)

  function toggleBurger() {
    setIsBurgerOpen(prevState => !prevState)
  }


  return (
    <div className="NavBar">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a id="SiteName" className="navbar-item" href="https://music.azukibar.dev">
            music.azukibar.dev
          </a>

          <a role="button" className={"navbar-burger" + (isBurgerOpen ? " is-active" : "")}
             aria-label="menu" aria-expanded="false"
             data-target="navBarBurger" onClick={toggleBurger}>
            <span aria-hidden="true"/>
            <span aria-hidden="true"/>
            <span aria-hidden="true"/>
          </a>
        </div>

        <div id="navbarBasicExample" className={"navbar-menu" + (isBurgerOpen ? " is-active" : "")}>
          <div className="navbar-start">
            <a className="navbar-item" href="https://azukibar.dev">
              Blog
            </a>

            <a className="navbar-item" href="https://twitter.com/azukibar_D">
              <FontAwesomeIcon icon={faTwitter}/>
              Twitter
            </a>
          </div>
        </div>
      </nav>
    </div>
  )
}
