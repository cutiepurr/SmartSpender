import React, {useState} from "react";
import LoginButton from "./Auth/LoginButton";
import {useAuth0} from "@auth0/auth0-react";
import LogoutButton from "./Auth/LogoutButton";

const NavMenu = ({className}) => {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <header className={className}>
      <div className="flex flex-col h-full">
        <div className="p-3">
          <button onClick={toggle} className="float-end lg:hidden">
            <i className="fa-solid fa-bars"></i>
          </button>
          <div>
            <a href="/" className="nav-link">
              <img className="float-start" src="/favicon/piggy-bank.png" alt="logo" style={{ maxHeight: 40 }} />
              <h1>Smart<br/>Spender</h1>
            </a>
          </div>
        </div>

         {/*Offcanvas when the screen is smaller than lg */}
        <div style={{ display: show ? "block" : "none" }} className="block lg:hidden">
          <div className="z-40 fixed top-0 left-0 w-screen h-screen flex flex-row">
            <NavContent className="bg-white" style={{ width: 250}} toggle={toggle}/>
            <div className="bg-black/50 w-full h-full" onClick={toggle}></div>
          </div>
        </div>
        
         {/*Sidebar when the screen is larger than lg */}
        <NavContent className="hidden lg:block" style={{width: 250}}/>
      </div>
    </header>
  );
};

const NavContent = ({toggle = null, ...props}) => {
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
    {
      name: "Monthly Targets",
      path: `/targets`,
    },
  ];

  return (

    <div {...props} className={`${props.className} h-full p-3 relative`}>
      { toggle !== null ? <i className="fa-solid fa-xmark float-end" onClick={toggle}></i> : null}
      <div className="pb-3">
        {
          isAuthenticated ?
            <>
              {links.map((link, index) => (
                <div key={index} className="py-1">
                  <a href={link.path} className="p-1 block">
                    {link.name}
                  </a>
                </div>
              ))}
            </> : null
        }
      </div>
      <div className="border-top py-3 absolute bottom-0">
        {isAuthenticated ? <LogoutButton/> : <LoginButton/>}
      </div>
    </div>
  );
}

export {NavMenu};
