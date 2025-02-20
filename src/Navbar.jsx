import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/slot-machine" className="nav-link" onClick={() => setIsOpen(false)}>Slot Machine</Link></li>
        <li><Link to="/blackjack" className="nav-link" onClick={() => setIsOpen(false)}>Blackjack</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
