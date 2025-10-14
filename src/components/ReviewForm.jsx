import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ movieId, existingReview, onReviewSubmitted, onReviewDeleted }) => {
  const { isAuthenticated, api, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to submit a review.');
      return;
    }
    
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      movieId: parseInt(movieId),
      rating,
      comment: comment.trim()
    };

    try {
      let response;
      if (existingReview && existingReview.id) {
        // Update existing review
        response = await api.put(`/reviews/${existingReview.id}`, reviewData);
      } else {
        // Create new review
        response = await api.post(`/reviews`, reviewData);
      }

      // Reset form
      if (!existingReview) {
        setRating(0);
        setComment('');
      }
      setIsEditing(false);
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data);
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit review. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.delete(`/reviews/${existingReview.id}`);
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Notify parent component
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setRating(existingReview.rating);
    setComment(existingReview.comment);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRating(existingReview.rating);
    setComment(existingReview.comment);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
          star <= (hoveredRating || rating)
            ? 'text-yellow-500 fill-yellow-500 scale-110'
            : 'text-gray-300 hover:text-yellow-300'
        }`}
        onClick={() => (isEditing || !existingReview) && setRating(star)}
        onMouseEnter={() => (isEditing || !existingReview) && setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
      />
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-medium">
          Please log in to write a review for this movie.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {existingReview ? 'Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium text-gray-700">Rating</label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-3 text-lg font-semibold text-gray-600">
                {rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="comment" className="text-lg font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="comment"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-colors"
            placeholder="Share your thoughts about this movie..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={existingReview && !isEditing}
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-500">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          {existingReview && !isEditing ? (
            // Display mode - show edit and delete buttons
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
                disabled={isSubmitting}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Review
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                disabled={isSubmitting}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Review
              </button>
            </>
          ) : (
            // Edit/Create mode - show save and cancel buttons
            <>
              {existingReview && isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;