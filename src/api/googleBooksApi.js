import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://www.googleapis.com/books/v1";

/** API Class.
 */

class GoogleBooksApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = {};
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("Google Books API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Search books */

  static async searchBooks(query) {
    try {
      const params = { q: query };
      const response = await this.request("volumes", params);
      return response.items;
    } catch (error) {
      console.error("Error searching books:", error);
      throw error;
    }
  }

}

GoogleBooksApi.token = "AIzaSyB_O97xzM6Jal7mAYJRt0XAr6r8mE_U5mk"

export default GoogleBooksApi;