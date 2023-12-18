import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 */

class allbookedApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${allbookedApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

/** Post a review */

  static async postReview(username, reviewData) {
    let res = await this.request(`reviews`, { username, ...reviewData }, "post");
    return res.review;
  }

// delete a review

  static async deleteReview(review_id) {
    let res = await this.request(`reviews/${review_id}`, {review_id}, "delete");
    return res
  }

  // Edit a review
  static async editReview(username, reviewId, updatedReviewData) {
    try {
      const res = await this.request(`reviews/${reviewId}`, { username, ...updatedReviewData }, "patch");
      return res.review;
    } catch (error) {
      console.error(`Error editing review ${reviewId}:`, error);
      throw error;
    }
  }
  
    // Get reviews for a specific book
    static async getBookReviews(google_books_api_id) {
      const res = await this.request(`reviews/book/${google_books_api_id}`);
      return res.reviews;
    }

      // Like a review
  static async likeReview(username, reviewId) {
    try {
      const response = await this.request(`reviewlikes`, { username, reviewId }, "post");
      return response.likeId;
    } catch (error) {
      console.error("Error liking review:", error);
      throw error;
    }
  }

  // Unlike a review
  static async unlikeReview(username, reviewId) {
    try {
      await this.request(`reviewlikes`, { username, reviewId }, "delete");
    } catch (error) {
      console.error("Error unliking review:", error);
      throw error;
    }
  }

  // Get like count for a review
  static async getReviewLikesCount(reviewId) {
    const res = await this.request(`reviewlikes/count/${reviewId}`);
    return res.likeCount;
  }

  static async getLikedReviews(username) {
    const res = await this.request(`reviewlikes/user/${username}`);
    return res.likes;
  }

  static async getReviewById(review_id) {
    const res = await this.request(`reviews/${review_id}`);
    return res.review;
  }

  static async getUserReviews(username) {
    try {
      const res = await this.request(`reviews/user/${username}`);
      return res.reviews;
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  }

    // Follow a user
    static async followUser(currentUser, targetUsername) {
      try {
        const res = await this.request('follow', {
          followerUsername: currentUser.username,
          followeeUsername: targetUsername,
        }, 'post');
  
        return res.message;
      } catch (error) {
        console.error(`Error following ${targetUsername}:`, error);
        throw error;
      }
    }
  
    // Unfollow a user
    static async unfollowUser(currentUser, targetUsername) {
      try {
        const res = await this.request('follow', {
          followerUsername: currentUser.username,
          followeeUsername: targetUsername,
        }, 'delete');
  
        return res.message; 
      } catch (error) {
        console.error(`Error unfollowing ${targetUsername}:`, error);
        throw error;
      }
    }

    // Fetch a user's follows

    static async getFollowing(username) {
      try {
        const response = await this.request(`users/${username}/following`);
        return response.following;
      } catch (error) {
        console.error(`Error getting following for ${username}:`, error);
        throw error;
      }
    }
}

// for now, put token ("testuser" / "password" on class)
allbookedApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvb2RhIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzAyNTc1MTE0fQ.g8k-3YwzADQ4ti--vdZdWjvWzB3QV_EJyyD2KT5xoQA";


export default allbookedApi;