import React, { useContext } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext.js";

function Home() {
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      {currentUser ? (
        // If user is logged in, show a welcome message
        <div>
          <h1 className="display-4">Welcome Back, {currentUser.username}!</h1>
        </div>
      ) : (
        // If user is not logged in, show a welcome message and login/signup buttons
        <div>
          <h1 className="display-4">allBooked</h1>
          <p className="lead">Unlock the World of Literature: Explore, Review, and Connect with Fellow Readers on allBooked – Your Gateway to a Global Community of Book Enthusiasts!</p>
          <hr className="my-2" />
          <p className="lead">
            <Link to="/auth/login">
              <Button color="primary">Login</Button>
            </Link>{" "}
            <Link to="/auth/register">
              <Button color="success">Sign Up</Button>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;