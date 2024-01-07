import React, { useState } from "react";
import {
  Button,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";

const NavMenu = () => {
  const today = new Date();
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Transactions",
      path: `/transactions/${today.getFullYear()}/${today.getMonth()+1}`,
    },
  ];

  const [show, setShow] = useState(true);
  const toggle = () => setShow(!show);

  return (
    <header>
      <nav className="p-3">
        <Button onClick={toggle} className="float-end" color="light">
          <i className="fa-solid fa-bars"></i>
        </Button>
        <div>
          <a href="/" className="nav-link"><h1>Smart Spender</h1></a>
        </div>

        <Collapse isOpen={show} className="mt-3">
          <Nav vertical>
            {links.map((link, index) => (
              <NavItem key={index}>
                <NavLink tag={Link} to={link.path} className="nav-tab">
                  {link.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>
      </nav>
    </header>
  );
};

export { NavMenu };
