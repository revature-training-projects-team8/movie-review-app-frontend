import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Film,
  User,
  ArrowLeft,
  Play,
  Info,
} from "lucide-react";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useAuth } from "../context/AuthContext";
// No more constants needed - using database directly

const MovieDetailPage = () => {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovieData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch movie details from database
      const movieResponse = await api.get(`/movies/${id}`);

      setMovie(movieResponse.data);

      // Fetch reviews for this movie from database

      const reviewsResponse = await api.get(`/reviews/movie/${id}`);
      const movieReviews = reviewsResponse.data;

      // Separate user's review from others
      const currentUserReview = movieReviews.find(
        (review) => user && review.userId === user.id
      );
      const otherReviews = movieReviews.filter(
        (review) => !user || review.userId !== user.id
      );

      setUserReview(currentUserReview || null);
      setReviews(otherReviews);
    } catch (error) {
      console.error("❌ Error fetching movie data:", error);
      if (error.response?.status === 403) {
        console.error("🚫 Authentication required - please log in");
        setError(
          "Authentication required. Please log in to view movie details."
        );
      } else if (error.response?.status === 404) {
        setError("Movie not found");
      } else {
        setError("Failed to load movie data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [id, user]);

  const handleReviewSubmitted = (newReview) => {
    setUserReview(newReview);
    // Refresh movie data to get updated average rating
    fetchMovieData();
  };

  const handleReviewDeleted = () => {
    setUserReview(null);
    // Refresh movie data to get updated average rating
    fetchMovieData();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 ${
          index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Film className="w-24 h-24 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Movie Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            {error || "The movie you're looking for doesn't exist."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Navigation */}
      <div className="bg-gray-900 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Movies
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Movie Details Section */}
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden mb-8 border border-gray-700">
          <div className="md:flex">
            {/* Movie Poster */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={movie.posterUrl}
                alt={`${movie.title} Poster`}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>

            {/* Movie Information */}
            <div className="md:w-2/3 lg:w-3/4 p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{new Date(movie.releaseDate).toDateString()}</span>
                  </div>

                  {movie.duration && (
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{movie.duration} minutes</span>
                    </div>
                  )}

                  <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {movie.genre}
                  </span>
                </div>

                {movie.director && (
                  <p className="text-lg text-gray-700 mb-4">
                    <span className="font-semibold">Directed by:</span>{" "}
                    {movie.director}
                  </p>
                )}

                {/* Rating Display */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-4">
                    {renderStars(Math.round(movie.avgRating || 0))}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {movie.avgRating?.toFixed(1) || "No ratings"}
                  </div>
                  <div className="ml-2 text-gray-500">
                    ({reviews.length + (userReview ? 1 : 0)} reviews)
                  </div>
                </div>

                {/* Movie Description */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Plot Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {movie.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <ReviewForm
              movieId={id}
              existingReview={userReview}
              onReviewSubmitted={handleReviewSubmitted}
              onReviewDeleted={handleReviewDeleted}
            />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700">
              <ReviewList reviews={reviews} currentUserId={user?.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
