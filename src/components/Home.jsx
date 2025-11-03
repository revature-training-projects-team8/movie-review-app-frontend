import { useState, useEffect, useContext } from "react";
import { FaStar, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import banner from '../assets/banner.jpg';


const Home = ({ movies, reviews, loading }) => {
  const [allMovies, setAllMovies] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
     // Get unique genres for filter
  const genres = [...new Set(allMovies.map(movie => movie.genre))];

  const filteredMovies = allMovies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === '' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Navigate to movie details page
  const handleReadReview = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Update local state when movies prop changes
  useEffect(() => {
    if (movies && movies.length > 0) {
      setAllMovies(movies);
    }
  }, [movies]);

  useEffect(() => { 
    if (reviews && reviews.length > 0) {
      setAllReviews(reviews);
       const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestReviews(sortedReviews.slice(0, 5));
    }
  }, [reviews]);
 
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
    <div className="min-h-screen bg-stone-800">

      {/* Hero Banner with Search */}
      <section 
        className="relative py-20 md:py-32 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        {/* Background overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Banner Content */}
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Discover • Rate • Review
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Your next favorite movie starts with someone’s review.
          </p>
          

{/* Filters */}
        
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <input
                type="text"
                placeholder="Search by title or director..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="relative w-full sm:w-40">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full p-3 pr-10 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none appearance-none bg-white/90 backdrop-blur-sm cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <option value="" className="text-gray-500">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre} className="text-gray-900">{genre}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaChevronDown className="text-gray-400 text-sm" />
              </div>
            </div>
          </div>


          {/* --- */}
        </div>
      </section>

      {/* All Movies Grid */}
      <section className="mt-10 container mx-auto px-4">
        <h2 className="text-2xl text-white font-semibold mb-4">All Movies</h2>
        {loading ? (
          <div className="text-center text-white text-lg">Loading movies...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {filteredMovies.map((movie) => (
            <div key={movie.id} className="bg-stone-900 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="aspect-[2/3] overflow-hidden rounded-t-lg">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base text-white truncate">{movie.title}</h3>
                <div className="flex mt-2">{renderStars(movie.averageRating)}</div>
                <button 
                  onClick={() => handleReadReview(movie.id)}
                  className="mt-3 px-3 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition w-full cursor-pointer"
                >
                  Read Review
                </button>
              </div>
            </div>
          ))}    
          </div>
        )}
      </section>

      {/* Latest Reviews */}
      <section className="mt-16 bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Reviews Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Latest Reviews</h2>
            <p className="text-gray-600 text-lg">
              See what our community is saying about the latest movies
            </p>
          </div>

          {/* Reviews Grid */}
          { latestReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No reviews available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {latestReviews.map((review, index) => (
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
                        <p className="text-sm text-orange-600 font-semibold">
                          reviewed "{review.movie?.title || review.movieTitle || 'Unknown Movie'}"
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Recently'}
                        </p>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    {review.rating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {review.rating}/5
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {review.comment}
                    </p>
                  </div>

                  {/* Review Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      
                      <button className="flex items-center space-x-1 hover:text-orange-500 transition-colors cursor-pointer" onClick={() => handleReadReview(review.movieId)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Movie</span>
                      </button>
                    </div>
                    
                    <span className="text-sm text-gray-400">
                      {formatToMMDDYYYY(review.reviewDate)}
                    </span>
                  </div>
                </div>

                {/* Orange Accent Bar */}
                <div className="h-1 bg-orange-500"></div>
              </div>
            ))}
            </div>
          )}

          {/* View All Reviews Button */}
          {/* {latestReviews.length > 0 && (
            <div className="text-center mt-10">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                More Reviews
              </button>
            </div>
          )} */}
        </div>
      </section>
    </div>
  );
};

export default Home;