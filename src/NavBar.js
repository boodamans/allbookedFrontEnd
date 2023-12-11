import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar } from "reactstrap";
import UserContext from "./context/UserContext";

function NavBar() {
    const { currentUser, logoutUser } = useContext(UserContext);
  return (
    <div>
      <Navbar expand="md">
        <NavLink exact='true' to="/" className="navbar-brand">
          Home
        </NavLink>
            <NavLink to="/search">Search</NavLink>
            {currentUser ? (
            // If user is logged in, show logout button
            <>
              <NavLink to="/editprofile">Edit Profile</NavLink>
              <NavLink to="/" onClick={logoutUser}>
                Log Out {currentUser.username}
              </NavLink>
              </>
          ) : (
            // If user is not logged in, show login and signup buttons
            <>
                <NavLink to="/auth/login">Login</NavLink>
                <NavLink to="/auth/register">Sign Up</NavLink>
            </>
          )}
      </Navbar>
    </div>
  );
}

export default NavBar;