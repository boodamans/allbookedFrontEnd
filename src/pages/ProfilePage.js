import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { useParams, Link } from 'react-router-dom';
import UserReviews from './UserReviews';
import allbookedApi from '../api/allbookedApi';
import './styles/ProfilePage.css'

const ProfilePage = () => {
  const { currentUser } = useContext(UserContext);
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        if (currentUser) {
          const followingList = await allbookedApi.getFollowing(currentUser.username);
          setIsFollowing(followingList.includes(username));
        }
      } catch (error) {
        console.error('Error checking if following:', error);
      }
    };

    checkIfFollowing();
  }, [currentUser, username]);

  const handleFollow = async () => {
    try {
      await allbookedApi.followUser(currentUser, username);
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await allbookedApi.unfollowUser(currentUser, username);
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (!currentUser) {
    // Redirect to login or handle the case where there's no logged-in user
    return <p><Link to='/auth/login'>Log in</Link> to view {username}'s profile.</p>;
  }

  const isCurrentUser = currentUser.username === username;

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <h1 className="profile-page-title">{username}</h1>
        {isCurrentUser && <Link to="/editprofile" className="edit-profile-link">Edit Profile</Link>}
      </div>
      {!isCurrentUser && (
        <div>
          {isFollowing ? (
            <button onClick={handleUnfollow} className="following-button">Unfollow</button>
          ) : (
            <button onClick={handleFollow} className="follow-button">Follow</button>
          )}
        </div>
      )}
      <h3 className="user-reviews">Reviews:</h3>
      <UserReviews username={username} />
    </div>
  );
};

export default ProfilePage;