import React, { useState, useEffect } from 'react';
import allbookedApi from '../api/allbookedApi';
import FeedReview from './FeedReview';

const Feed = () => {
  const [feedReviews, setFeedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedReviews = async () => {
      try {
        const feedReviewsData = await allbookedApi.getFeed();
        setFeedReviews(feedReviewsData);
      } catch (error) {
        console.error('Error fetching feed reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedReviews();
  }, []);

  if (loading) {
    return <p>Loading feed...</p>;
  }

  return (
    <div>
      <h2>Feed</h2>
      {feedReviews.map((review) => (
        <FeedReview key={review.review_id} review={review} />
      ))}
    </div>
  );
};

export default Feed;
