import React, { useState, useEffect } from 'react';
import { checkBackendHealth, getAllMoviesFromDB, API_BASE_URL } from '../utils/constants';

const AdminPanel = () => {
  const [backendStatus, setBackendStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [moviesInDB, setMoviesInDB] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    releaseDate: '',
    director: '',
    genre: '',
    description: '',
    posterUrl: '',
    duration: 120
  });

  useEffect(() => {
    checkBackend();
    refreshMoviesList();
  }, []);

  const checkBackend = async () => {
    try {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy);
      if (!isHealthy) {
        console.error('Backend health check failed');
      }
    } catch (error) {
      console.error('Error checking backend:', error);
      setBackendStatus(false);
    }
  };

  const refreshMoviesList = async () => {
    setIsLoading(true);
    try {
      const movies = await getAllMoviesFromDB();
      setMoviesInDB(movies);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      releaseDate: '',
      director: '',
      genre: '',
      description: '',
      posterUrl: '',
      duration: 120
    });
    setEditingMovie(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePosterUrl = (url) => {
    const MAX_URL_LENGTH = 255;
    if (url && url.length > MAX_URL_LENGTH) {
      return {
        valid: false,
        error: `Poster URL is too long (${url.length} characters). Maximum allowed is ${MAX_URL_LENGTH} characters.\n\nTip: Use direct image URLs instead of Google redirect URLs. Right-click the image and select "Copy image address".`
      };
    }
    return { valid: true };
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    
    // Validate poster URL length
    const urlValidation = validatePosterUrl(formData.posterUrl);
    if (!urlValidation.valid) {
      alert(urlValidation.error);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const url = API_BASE_URL + '/movies';
      
      // Backend model uses camelCase
      const movieData = {
        title: formData.title,
        releaseDate: formData.releaseDate,
        director: formData.director,
        genre: formData.genre,
        description: formData.description,
        posterUrl: formData.posterUrl,
        duration: formData.duration
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(movieData)
      });

      if (response.ok) {
        alert('Movie created successfully!');
        resetForm();
        refreshMoviesList();
      } else {
        const error = await response.text();
        alert('Failed to create movie: ' + error);
      }
    } catch (error) {
      console.error('Error creating movie:', error);
      alert('Error creating movie');
    }
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    
    // Validate poster URL length
    const urlValidation = validatePosterUrl(formData.posterUrl);
    if (!urlValidation.valid) {
      alert(urlValidation.error);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const url = API_BASE_URL + '/movies/' + editingMovie.id;
      
      // Backend model uses camelCase
      const movieData = {
        title: formData.title,
        releaseDate: formData.releaseDate,
        director: formData.director,
        genre: formData.genre,
        description: formData.description,
        posterUrl: formData.posterUrl,
        duration: formData.duration
      };
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(movieData)
      });

      if (response.ok) {
        alert('Movie updated successfully!');
        resetForm();
        refreshMoviesList();
      } else {
        const error = await response.text();
        alert('Failed to update movie: ' + error);
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Error updating movie');
    }
  };

  const handleEditClick = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      releaseDate: movie.releaseDate || '',
      director: movie.director || '',
      genre: movie.genre || '',
      description: movie.description || '',
      posterUrl: movie.posterUrl || '',
      duration: movie.duration || 120
    });
    setShowForm(true);
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = API_BASE_URL + '/movies/' + id;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        alert('Movie deleted successfully!');
        refreshMoviesList();
      } else {
        const error = await response.text();
        alert('Failed to delete movie: ' + error);
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Error deleting movie');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Admin Dashboard</h1>

      <div className={backendStatus ? 'mb-6 p-4 rounded bg-green-100' : 'mb-6 p-4 rounded bg-red-100'}>
        <p className="font-semibold">
          Backend Status: {backendStatus === null ? '⏳ Checking...' : backendStatus ? '✅ Connected' : '❌ Disconnected'}
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? '❌ Cancel' : '➕ Add New Movie'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {editingMovie ? '✏️ Edit Movie' : '➕ Create New Movie'}
          </h2>
          <form onSubmit={editingMovie ? handleUpdateMovie : handleCreateMovie}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-semibold">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Enter movie title"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Release Date *</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Director *</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Enter director name"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Genre *</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="e.g., Action, Drama"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Poster URL
                  {formData.posterUrl && (
                    <span className={`ml-2 text-sm ${formData.posterUrl.length > 255 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                      ({formData.posterUrl.length}/255 characters)
                    </span>
                  )}
                </label>
                <input
                  type="url"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded ${formData.posterUrl && formData.posterUrl.length > 255 ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder="https://example.com/poster.jpg"
                />
                {formData.posterUrl && formData.posterUrl.length > 255 && (
                  <p className="text-red-600 text-sm mt-1">
                    ⚠️ URL too long! Use direct image URL. Right-click image → "Copy image address"
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2 font-semibold">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  placeholder="120"
                  min="1"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full border p-2 rounded"
                placeholder="Enter movie description..."
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                {editingMovie ? '💾 Update Movie' : '➕ Create Movie'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📋 Movies in Database ({moviesInDB.length})</h2>
        {isLoading ? (
          <p>⏳ Loading movies...</p>
        ) : moviesInDB.length === 0 ? (
          <p className="text-gray-500">No movies in database</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Title</th>
                  <th className="border p-2 text-left">Director</th>
                  <th className="border p-2 text-left">Genre</th>
                  <th className="border p-2 text-left">Release Date</th>
                  <th className="border p-2 text-left">Duration</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {moviesInDB.map(movie => (
                  <tr key={movie.id} className="hover:bg-gray-50">
                    <td className="border p-2">{movie.id}</td>
                    <td className="border p-2 font-semibold">{movie.title}</td>
                    <td className="border p-2">{movie.director}</td>
                    <td className="border p-2">{movie.genre}</td>
                    <td className="border p-2">{movie.releaseDate}</td>
                    <td className="border p-2">{movie.duration} min</td>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(movie)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;