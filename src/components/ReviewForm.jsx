import React, { useState, useEffect } from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ReviewForm = ({
  movieId,
  existingReview,
  onReviewSubmitted,
  onReviewDeleted,
}) => {
  const { isAuthenticated, api, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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
      alert("Please log in to submit a review.");
      return;
    }

    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      rating,
      comment: comment.trim(),
    };

    try {
      let response;
      if (existingReview && existingReview.id) {
        // Update existing review
        response = await api.put(`/reviews/${existingReview.id}`, reviewData);
      } else {
        // Create new review - use correct endpoint with movieId in URL
        response = await api.post(`/reviews/movie/${movieId}`, reviewData);
      }

      // Reset form
      if (!existingReview) {
        setRating(0);
        setComment("");
      }
      setIsEditing(false);

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      console.error("Review data sent:", reviewData);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit review. Please try again.";
      alert(`Submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.delete(`/reviews/${existingReview.id}`);

      // Reset form
      setRating(0);
      setComment("");

      // Notify parent component
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
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
        className={`w-10 h-10 cursor-pointer transition-all duration-300 ${
          star <= (hoveredRating || rating)
            ? "text-yellow-400 fill-yellow-400 scale-125 drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
            : "text-gray-600 hover:text-yellow-300 hover:scale-110"
        }`}
        onClick={() => (isEditing || !existingReview) && setRating(star)}
        onMouseEnter={() =>
          (isEditing || !existingReview) && setHoveredRating(star)
        }
        onMouseLeave={() => setHoveredRating(0)}
      />
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 border-2 border-lime-500 rounded-xl p-8 text-center shadow-2xl shadow-lime-500/10">
        <div className="text-6xl mb-4">🔐</div>
        <p className="text-lime-400 font-bold text-lg">
          Authentication Required: Please log in to deploy your review analysis.
        </p>
        <p className="text-gray-300 mt-2">
          Access the review command center to share your movie intelligence.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black border-2 border-lime-500 rounded-xl shadow-2xl shadow-lime-500/20 p-8">
      <h3 className="text-3xl font-bold text-lime-400 mb-6 flex items-center">
        <span className="mr-3">⭐</span>
        {existingReview ? "Review Command Center" : "Deploy New Review"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
          <label className="block text-xl font-bold text-lime-400 mb-4 uppercase tracking-wide">
            ⭐ Mission Rating Assessment
          </label>
          <div className="flex items-center space-x-2 mb-4">
            {renderStars()}
          </div>
          {rating > 0 && (
            <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-3">
              <span className="text-lime-300 font-bold text-lg">
                🎯 Rating Deployed: {rating} out of 5 stars
              </span>
            </div>
          )}
        </div>

        {/* Comment */}
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
          <label
            htmlFor="comment"
            className="block text-xl font-bold text-lime-400 mb-4 uppercase tracking-wide"
          >
            📝 Intelligence Report
          </label>
          <textarea
            id="comment"
            rows="5"
            className="w-full bg-gray-800 border-2 border-gray-600 text-white p-4 rounded-lg focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 resize-none transition-all duration-200 placeholder-gray-400"
            placeholder="Deploy your detailed analysis and tactical assessment of this cinematic mission..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={existingReview && !isEditing}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="text-lime-300 text-sm font-bold">
              📊 Report Status: {comment.length > 0 ? "Active" : "Standby"}
            </div>
            <div className="text-lime-400 text-sm font-mono">
              {comment.length}/1000 characters
            </div>
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
                className="flex items-center px-4 py-2 bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-500 hover:to-lime-600 text-black font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-lime-500/20 border border-lime-500 hover:border-lime-400"
                disabled={isSubmitting}
              >
                <Edit className="w-5 h-5 mr-2 text-black" />
                EDIT REVIEW
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/20 border border-red-600 hover:border-red-500"
                disabled={isSubmitting}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                DELETE REVIEW
              </button>
            </>
          ) : (
            // Edit/Create mode - show save and cancel buttons
            <>
              {existingReview && isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-500 hover:to-lime-600 text-black font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-lime-500/20 disabled:opacity-50 disabled:cursor-not-allowed border border-lime-500 hover:border-lime-400"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting
                  ? "SUBMITTING..."
                  : existingReview
                  ? "UPDATE REVIEW"
                  : "SUBMIT REVIEW"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
