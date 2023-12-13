import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import { useParams, Link } from 'react-router-dom';
import UserReviews from './UserReviews';


const ProfilePage = () => {
  const { currentUser } = useContext(UserContext);
  const { username } = useParams(); 

  if (!currentUser) {
    // Redirect to login or handle the case where there's no logged-in user
    return <p>Please log in to view your profile.</p>;
  }

  const isCurrentUser = currentUser.username === username;


  return (
    <div>
      <h1>{username}</h1>
      {isCurrentUser && <Link to="/editprofile">Edit Profile</Link>}
      <h3>Reviews:</h3>
      <UserReviews username={username}/>
    </div>
  );
};

export default ProfilePage;
