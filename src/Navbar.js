import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="navbar">
            <span><Link to="/">Current </Link></span>
            <span><Link to="/forecast">Forecast </Link></span>
        </div>
    );
}

export default Navbar;
