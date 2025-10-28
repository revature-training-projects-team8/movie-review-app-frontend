import React, { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Film,
  Edit,
  Trash2,
  MessageCircle,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, api, isAuthenticated } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    favoriteGenre: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReviews();
    }
  }, [isAuthenticated]);

  const fetchUserReviews = async () => {
    setLoading(true);
    try {
      // Try different possible endpoints for user reviews
      let reviewsResponse;
      try {
        // First try: /reviews/user/{id}
        reviewsResponse = await api.get(`/reviews/user/${user.id}`);
      } catch (error1) {
        try {
          // Second try: /reviews/my-reviews (common REST pattern)
          reviewsResponse = await api.get(`/reviews/my-reviews`);
        } catch (error2) {
          // Third try: get all reviews and filter (fallback)
          const allReviewsResponse = await api.get(`/reviews`);
          const allReviews = allReviewsResponse.data;
          const userReviewsFiltered = allReviews.filter(
            (review) => review.userId === user.id
          );
          reviewsResponse = { data: userReviewsFiltered };
        }
      }

      const reviews = reviewsResponse.data;

      // Fetch movie details for each review
      const moviePromises = reviews.map((review) =>
        api.get(`/movies/${review.movieId}`).catch(() => null)
      );
      const movieResponses = await Promise.all(moviePromises);

      // Create movies lookup
      const moviesLookup = {};
      movieResponses.forEach((response, index) => {
        if (response) {
          moviesLookup[reviews[index].movieId] = response.data;
        }
      });

      setUserReviews(reviews);
      setMovies(moviesLookup);
      calculateStats(reviews, moviesLookup);
    } catch (error) {
      console.error("❌ All review fetching methods failed:", error);
      console.error("📊 Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      // No reviews found - display empty state
      setUserReviews([]);
      setMovies({});
      calculateStats([], {});
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviews, moviesLookup) => {
    if (reviews.length === 0) {
      setStats({ totalReviews: 0, averageRating: 0, favoriteGenre: "" });
      return;
    }

    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    // Calculate favorite genre
    const genreCounts = {};
    reviews.forEach((review) => {
      const movie = moviesLookup[review.movieId];
      if (movie && movie.genre) {
        genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
      }
    });

    const favoriteGenre = Object.keys(genreCounts).reduce(
      (a, b) => (genreCounts[a] > genreCounts[b] ? a : b),
      ""
    );

    setStats({ totalReviews, averageRating, favoriteGenre });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      const updatedReviews = userReviews.filter(
        (review) => review.id !== reviewId
      );
      setUserReviews(updatedReviews);
      calculateStats(updatedReviews, movies);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 transition-all duration-300 ${
          index < rating
            ? "text-yellow-400 fill-yellow-400 drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
            : "text-gray-600"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Film className="w-24 h-24 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 mb-8 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mr-6">
              <span className="text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.username}
              </h1>
              <p className="text-gray-300">Movie Enthusiast</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 border border-blue-500 rounded-lg p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-400">
                {stats.totalReviews}
              </h3>
              <p className="text-gray-300 font-medium">Reviews Written</p>
            </div>

            <div className="bg-gray-800 border border-yellow-500 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-yellow-400">
                {stats.averageRating.toFixed(1)}
              </h3>
              <p className="text-gray-300 font-medium">Average Rating</p>
            </div>

            <div className="bg-gray-800 border border-green-500 rounded-lg p-6 text-center">
              <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-green-400">
                {stats.favoriteGenre || "N/A"}
              </h3>
              <p className="text-gray-300 font-medium">Favorite Genre</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-blue-400" />
            Your Reviews
          </h2>

          {userReviews.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-300 mb-6">
                Start reviewing movies to see them appear here!
              </p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Film className="w-5 h-5 mr-2" />
                Browse Movies
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {userReviews.map((review) => {
                const movie = movies[review.movieId];
                return (
                  <div
                    key={review.id}
                    className="border border-gray-600 bg-gray-800 rounded-lg p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Movie Poster */}
                      {movie && (
                        <img
                          src={movie.posterUrl}
                          alt={`${movie.title} Poster`}
                          className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                        />
                      )}

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {movie?.title || "Unknown Movie"}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-300">
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                                <span className="ml-2 font-semibold text-yellow-400">
                                  {review.rating}/5
                                </span>
                              </div>
                              {review.createdAt && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>{formatDate(review.createdAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {review.comment}
                        </p>

                        {movie && (
                          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                            <span className="bg-gray-700 border border-gray-600 px-2 py-1 rounded-full text-gray-300">
                              {movie.genre}
                            </span>
                            <span>{movie.director}</span>
                            <span>
                              {new Date(movie.releaseDate).getFullYear()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
