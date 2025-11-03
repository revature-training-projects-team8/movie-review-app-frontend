import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context.jsx';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
// import Toast from "../context.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Movie = ({movies, onReviewAdded, movieUpdate}) => {
  const { id } = useParams(); 
  const { context } = useContext(UserContext);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  
  // Find the movie with the matching ID
  const movie = movies.find(movie => movie.id.toString() === id);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        setReviewsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/reviews/movie/${id}`);
        // Backend should return reviews with populated user data (username via userId)
        // Sort reviews by creation date (newest first)
        const sortedReviews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sortedReviews);
        setReviewsError('');
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsError('Failed to load reviews');
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // If no movie found, show error or loading state
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-400">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <p className="text-gray-300">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Review form handlers
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!context?.currentUser) {
      alert('Please login to write a review');
      return;
    }

    setIsSubmittingReview(true);
    try {
      // Submit review to database (only userId, not username)
      const reviewPayload = {
        movieId: parseInt(id),
        userId: context.currentUser.id,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim()
      };

      const response = await axios.post(`http://localhost:8080/api/reviews/movie/${id}`, reviewPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.currentUser.token}`
        }
      });

      // Add the new review to the top of the reviews list
      const newReview = response.data;
      setReviews(prevReviews => [newReview, ...prevReviews]);

      // Reset form and hide it
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Review submitted successfully!');

      // Notify parent component about the new review
      if (onReviewAdded) {
        onReviewAdded();
        movieUpdate();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        alert(error.response.data.message || 'Failed to submit review. Please try again.');
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleWriteReviewClick = () => {
    if (!context?.currentUser) {
      alert('Please login to write a review');
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

   // Render stars
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <FaStar key={i} className={`inline-block ${i <= rating ? "text-yellow-400" : "text-gray-300"}`} />
        );
      }
      return stars;
    };


    function formatToMMDDYYYY(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
 }

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Stylish Movie Header Card */}
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden mb-8">
          
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row">
            
            {/* Movie Poster */}
            <div className="lg:w-1/3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
            </div>

            {/* Movie Information */}
            <div className="lg:w-2/3 p-8 lg:p-12 flex flex-col justify-center bg-white">
                
                {/* Title Section */}
                <div className="mb-6">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3 leading-tight">
                    {movie.title}
                  </h1>
                  
                  {/* Movie Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {movie.genre}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {movie.duration} minutes
                    </span>
                  </div>
                </div>

                {/* Director Info */}
                {movie.director && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                          Director
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {movie.director}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(movie.averageRating)}
                      </div>
                      <span className="text-2xl font-bold text-gray-800">
                        {movie.averageRating}/5
                      </span>
                    </div>
                    
                    <div className="hidden lg:block w-px h-8 bg-gray-300"></div>
                    
                    <div className="hidden lg:flex items-center space-x-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {reviews.length === 0 ? <span className="text-sm">No Reviews</span> : (reviews.length === 1 ? <span className="text-sm">1 Review</span> : <span className="text-sm">{reviews.length} Reviews</span>)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Synopsis</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {movie.description}
                  </p>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex flex-wrap gap-3">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Add to Favorites</span>
                  </button>
                  
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-300 transition-all duration-200 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div> */}

              </div>
            </div>
            
            {/* Orange Accent Bar */}
            <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Reviews Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">User Reviews</h2>
                <p className="text-gray-600">
                  {reviews.length === 0 ? <span>No Reviews</span> : (reviews.length === 1 ? <span>1 Review</span> : <span>{reviews.length} Reviews</span>)} • Average rating: {movie.averageRating}/5
                </p>
              </div>
              <button 
                onClick={handleWriteReviewClick}
                className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {context?.currentUser 
                  ? (showReviewForm ? 'Cancel Review' : 'Write a Review')
                  : 'Login to Write Review'
                }
              </button>
            </div>

            {/* Review Form - Only show for authenticated users */}
            {showReviewForm && context?.currentUser && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Write Your Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (1-5)
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={reviewData.rating}
                      onChange={handleReviewChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  {/* Comment */}
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={reviewData.comment}
                      onChange={handleReviewChange}
                      required
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-vertical"
                      placeholder="Share your thoughts about this movie..."
                    />
                  </div>

                  {/* User Info */}
                  {context?.currentUser && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        Posting as: <span className="font-semibold text-gray-800">{context.currentUser.username}</span>
                      </p>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex space-x-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !reviewData.comment.trim()}
                      className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                        isSubmittingReview || !reviewData.comment.trim()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews Grid */}
            <div className="space-y-6">
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
              ) : reviewsError ? (
                <div className="text-center py-8 text-red-600">
                  <p>{reviewsError}</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 mb-6">Be the first to share your thoughts about this movie!</p>
                  <button 
                    onClick={handleWriteReviewClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {context?.currentUser ? 'Write First Review' : 'Login to Write Review'}
                  </button>
                </div>
              ) : (
                reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {(review.user?.username || review.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        
                        {/* Reviewer Info */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {review.user?.username || review.username || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Verified Reviewer
                          </p>
                        </div>
                      </div>

                      {/* Rating Display */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {review.comment}
                      </p>
                    </div>

                    {/* Review Footer */}
                    <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                      {/* <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V6a2 2 0 012-2h2.5L10 7m4 3v10m-4-3h6m-6-3h6" />
                          </svg>
                          <span>Helpful ({Math.floor(Math.random() * 20) + 1})</span>
                        </button>
                        
                        <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                          </svg>
                          <span>Report</span>
                        </button>
                      </div> */}
                      
                      <span className="text-sm text-gray-400">
                        {formatToMMDDYYYY(review.reviewDate)}
                      </span>
                    </div>
                  </div>

                  {/* Gradient Border Effect */}
                  <div className="h-1 bg-orange-500"></div>
                </div>
              ))
              )}
            </div>

            {/* Load More Reviews Button */}
            {/* {reviews.length > 0 && (
              <div className="text-center mt-8">
                <button className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                  Load More Reviews
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Movie;



