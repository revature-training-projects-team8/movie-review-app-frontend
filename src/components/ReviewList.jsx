import React from 'react';
import { Star, Calendar, User as UserIcon } from 'lucide-react';

const ReviewList = ({ reviews, currentUserId }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <Star className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
        <p className="text-gray-500">Be the first to share your thoughts about this movie!</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        User Reviews ({reviews.length})
      </h3>
      
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition-all hover:shadow-lg ${
            review.userId === currentUserId ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <UserIcon className="w-4 h-4 text-gray-600 mr-2" />
                <span className="font-semibold text-gray-800">{review.username}</span>
                {review.userId === currentUserId && (
                  <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                    Your Review
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
                <span className="ml-2 font-bold text-gray-700">{review.rating}/5</span>
              </div>
              {review.createdAt && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;