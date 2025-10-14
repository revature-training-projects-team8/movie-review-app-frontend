import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Film } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { getAllMoviesFromDB, checkBackendHealth, getAllMovies } from '../utils/constants';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(true);

  const genres = [...new Set(movies.map(movie => movie.genre))];

  const loadMoviesFromDatabase = async () => {
    setLoading(true);
    try {
      console.log('🎬 Loading movies from database...');
      
      // First check if backend is available
      const backendAvailable = await checkBackendHealth();
      
      if (backendAvailable) {
        // Try to load movies from database
        const moviesData = await getAllMoviesFromDB();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        console.log(`✅ Loaded ${moviesData.length} movies from database successfully!`);
      } else {
        // Fallback to local data if backend is not available
        console.log('🔄 Backend not available, using local movie data');
        const moviesData = await getAllMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        console.log(`📁 Loaded ${moviesData.length} movies from local data`);
      }
    } catch (error) {
      console.error('❌ Error loading movies:', error);
      // Final fallback to local data
      try {
        const moviesData = await getAllMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        console.log(`📁 Fallback: Loaded ${moviesData.length} movies from local data`);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoviesFromDatabase();
  }, []);

  useEffect(() => {
    let filtered = movies;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }
    
    // Sort movies
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.avgRating || 0) - (a.avgRating || 0);
        case 'year':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });
    
    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/30 backdrop-blur-lg rounded-full p-6 shadow-2xl border-2 border-white/50">
                <Film className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight" style={{textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'}}>
              <span className="text-white">
                Discover Amazing Movies
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-medium" style={{textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.6)'}}>
              Explore our curated collection of <span className="font-bold text-yellow-300">{movies.length} films</span> and share your thoughts with the community
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/30 backdrop-blur-md rounded-xl px-8 py-4 border-2 border-white/50 shadow-2xl">
                <div className="text-5xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{movies.length}</div>
                <div className="text-sm text-white font-bold mt-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>Movies</div>
              </div>
              <div className="bg-white/30 backdrop-blur-md rounded-xl px-8 py-4 border-2 border-white/50 shadow-2xl">
                <div className="text-5xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{genres.length}</div>
                <div className="text-sm text-white font-bold mt-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>Genres</div>
              </div>
              <div className="bg-white/30 backdrop-blur-md rounded-xl px-8 py-4 border-2 border-white/50 shadow-2xl">
                <div className="text-5xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
                  {movies.length > 0 ? (movies.reduce((sum, m) => sum + (m.avgRating || 0), 0) / movies.length).toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-white font-bold mt-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search movies, genres, or directors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Genre Filter */}
            <div className="relative md:w-56">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border-2 border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-all outline-none text-white"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all outline-none text-white md:w-48"
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="year">Sort by Year</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {filteredMovies.length} {filteredMovies.length === 1 ? 'Movie' : 'Movies'} Found
            {selectedGenre && (
              <span className="ml-2 text-lg font-normal text-gray-300">in {selectedGenre}</span>
            )}
          </h2>
          
          {(searchTerm || selectedGenre) && (
            <button
              onClick={clearFilters}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-300">Initializing movie database and loading movies...</span>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <Film className="w-24 h-24 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No movies found</h3>
            <p className="text-gray-400">
              {searchTerm ? `No movies match "${searchTerm}"` : 'Try adjusting your filters'}
            </p>
            {(searchTerm || selectedGenre) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;