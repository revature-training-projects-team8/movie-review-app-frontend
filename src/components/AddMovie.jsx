import React, { useState } from 'react';
import axios from 'axios';

const AddMovie = ({ onMovieAdded, BASE_URL }) => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    releaseDate: '',
    genre: '',
    duration: '',
    description: '',
    posterUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const token = sessionStorage.getItem('token');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert duration to number
      const movieData = {
        ...formData,
        duration: parseInt(formData.duration)
      };

      // Make API call to add movie
      const response = await axios.post(`${BASE_URL}/api/movies`, movieData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Movie added successfully:', response.data);
      
      // Reset form on success
      setFormData({
        title: '',
        director: '',
        releaseDate: '',
        genre: '',
        duration: '',
        description: '',
        posterUrl: ''
      });

      setMessage({ 
        type: 'success', 
        text: 'Movie added successfully!' 
      });

      // Refresh the movies list in the parent component
      if (onMovieAdded) {
        onMovieAdded();
      }

    } catch (error) {
      console.error('Error adding movie:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to add movie. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-400 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Add New Movie
          </h1>

          {/* Success/Error Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Movie Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Movie Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter movie title"
              />
            </div>

            {/* Director */}
            <div>
              <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-2">
                Director *
              </label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter director name"
              />
            </div>

            {/* Release Date and Genre Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date *
                </label>
                <input
                  type="date"
                  id="releaseDate"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Genre</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Animation">Animation</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Crime">Crime</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                max="500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., 120"
              />
            </div>

            {/* Poster URL */}
            <div>
              <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Poster URL
              </label>
              <input
                type="url"
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-vertical"
                placeholder="Enter movie description..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-500'
                }`}
              >
                {isSubmitting ? 'Adding Movie...' : 'Add Movie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;