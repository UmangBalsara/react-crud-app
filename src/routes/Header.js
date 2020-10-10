import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const Header = () => {
  return (
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>React Js Modal</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link to="/">Home</Nav.Link>
          <Nav.Link to="/project/:id">Project Details</Nav.Link>
        </Nav>
      </Navbar>
    </div>
  );
};

export default Header;
