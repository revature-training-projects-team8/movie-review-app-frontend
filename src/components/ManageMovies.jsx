import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const ManageMovies = ({ movies, onMovieDeleted, loading, BASE_URL }) => {
  const navigate = useNavigate();
  const [localMovies, setLocalMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (movies) {
      setLocalMovies(movies);
    }
  }, [movies]);

  // Filter movies based on search and genre
  const filteredMovies = localMovies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === '' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Get unique genres for filter
  const genres = [...new Set(localMovies.map(movie => movie.genre))];
  
  const token = sessionStorage.getItem('token');
  // Handle delete movie
  const handleDelete = async (movieId) => {
    try {
      await axios.delete(`${BASE_URL}/api/movies/${movieId}`,
        {
  headers: {
    Authorization: `Bearer ${token}`
  }
        }
      );
      setLocalMovies(prev => prev.filter(movie => movie.id !== movieId));
      setDeleteConfirm(null);
      // You might want to trigger a refresh of the movies data in the parent component
      if (onMovieDeleted) {
        onMovieDeleted();
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie. Please try again.');
    }
  };

  // Handle view movie details
  const handleView = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Handle edit movie (you can create an edit component later)
  const handleEdit = (movieId) => {
    // For now, navigate to add movie with edit mode
    navigate(`/edit-movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Manage Movies
              </h1>
              <p className="text-gray-600">
                View, edit, and delete movies from your database
              </p>
            </div>
            <button
              onClick={() => navigate('/add-movie')}
              className="mt-4 md:mt-0 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add New Movie
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Movies
              </label>
              <input
                type="text"
                placeholder="Search by title or director..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Movies Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredMovies.length} of {localMovies.length} movies
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Movie Poster */}
              <div className="aspect-[2/3] overflow-hidden">
                <img 
                  src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Movie Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Director: {movie.director}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  {movie.releaseDate} • {movie.genre}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  ⭐ {movie.rating}/10 • {movie.duration} min
                </p>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(movie.id)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  
                  <button
                    onClick={() => handleEdit(movie.id)}
                    className="flex-1 bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => setDeleteConfirm(movie.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Movies Found */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No movies found matching your criteria.</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this movie? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageMovies;