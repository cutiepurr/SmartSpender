import React, {useState} from "react";
import {Button, Offcanvas, OffcanvasBody, OffcanvasHeader,} from "reactstrap";
import "./NavMenu.css";
import LoginButton from "./Auth/LoginButton";
import {useAuth0} from "@auth0/auth0-react";
import LogoutButton from "./Auth/LogoutButton";

const NavMenu = ({className}) => {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <header className={className}>
      <div className="h-100 d-flex flex-column">
        <div className="p-3">
          <Button onClick={toggle} className="float-end d-lg-none" color="light">
            <i className="fa-solid fa-bars"></i>
          </Button>
          <div>
            <a href="/" className="nav-link">
              <img className="float-start" src="/favicon/piggy-bank.png" alt="logo" style={{ maxHeight: 40 }} />
              <h1>Smart<br/>Spender</h1>
            </a>
          </div>
        </div>
        
        {/* Offcanvas when the screen is smaller than lg */}
        <Offcanvas isOpen={show} toggle={toggle} className="d-lg-none">
          <OffcanvasHeader toggle={toggle}></OffcanvasHeader>
          <OffcanvasBody>
            <NavContent className="bg-white"/>
          </OffcanvasBody>
        </Offcanvas>

        {/* Sidebar when the screen is larger than lg */}
        <NavContent className="d-none d-lg-block" style={{width: 250}}/>
      </div>
    </header>
  );
};

const NavContent = (props) => {
  const {isAuthenticated} = useAuth0();
  const today = new Date();
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Transactions",
      path: `/transactions/${today.getFullYear()}/${today.getMonth() + 1}`,
    },
  ];

  return (

    <div {...props} className={`${props.className} h-100 p-3 position-relative`}>
      <div className="pb-3">
        {
          isAuthenticated ?
            <>
              {links.map((link, index) => (
                <div key={index} className="py-1">
                  <a href={link.path} className="nav-tab p-2 d-block">
                    {link.name}
                  </a>
                </div>
              ))}
            </> : null
        }
      </div>
      <div className="border-top py-3 position-absolute bottom-0">
        {isAuthenticated ? <LogoutButton/> : <LoginButton/>}
      </div>
    </div>
  );
}

export {NavMenu};
