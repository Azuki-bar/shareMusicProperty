import Link from "next/link";
import React, {useState} from "react";

export const NavBar = (props) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false)

  function toggleBurger() {
    setIsBurgerOpen(prevState => !prevState)
  }


  return (
    <div className="NavBar">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        {/*<div className="navbar-brand">*/}
        {/*  <div className="navbar-item">*/}
        {/*    <a href={"https://music.azukibar.dev"}>music.azukibar.dev</a>*/}

        {/*    <i className="fab fa-twitter"/>*/}
        {/*  </div>*/}
        {/*  <div className="navbar-menu">*/}
        {/*    <div className="navbar-item">*/}
        {/*      <a href={"https://github.azukibar.dev"}>github.azukibar.dev</a>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="navbar-brand">
          <div id="SiteName" className="navbar-item">
            <a href="https://music.azukibar.dev">music.azukibar.dev</a>
          </div>

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
            <div className="navbar-item">
              <Link href={"/"}>
                Home
              </Link>
            < /div>

            <a className="navbar-item">
              GitHub
            </a>

            {/*<div className="navbar-item has-dropdown is-hoverable">*/}
            {/*  <a className="navbar-link">*/}
            {/*    More*/}
            {/*  </a>*/}

            {/*<div className="navbar-dropdown">*/}
            {/*  <a className="navbar-item">*/}
            {/*    About*/}
            {/*  </a>*/}
            {/*  <a className="navbar-item">*/}
            {/*    Jobs*/}
            {/*  </a>*/}
            {/*  <a className="navbar-item">*/}
            {/*    Contact*/}
            {/*  </a>*/}
            {/*  <hr className="navbar-divider"/>*/}
            {/*  <a className="navbar-item">*/}
            {/*    Report an issue*/}
            {/*  </a>*/}
            {/*</div>*/}
            {/*</div>*/}
          </div>

          {/*<div className="navbar-end">*/}
          {/*  <div className="navbar-item">*/}
          {/*    <div className="buttons">*/}
          {/*      <a className="button is-primary">*/}
          {/*        <strong>Sign up</strong>*/}
          {/*      </a>*/}
          {/*      <a className="button is-light">*/}
          {/*        Log in*/}
          {/*      </a>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </nav>
    </div>
  )
}
