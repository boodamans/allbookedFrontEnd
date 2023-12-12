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
    try {
      const response = await this.request(`reviewlikes/count/${reviewId}`, {}, "get");
      return response.likeCount;
    } catch (error) {
      console.error("Error getting review likes count:", error);
      throw error;
    }
  }
}

// for now, put token ("testuser" / "password" on class)
allbookedApi.token = "";


export default allbookedApi;