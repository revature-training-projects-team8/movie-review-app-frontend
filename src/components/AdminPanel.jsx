import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";

const AdminPanel = () => {
  const { api, user } = useAuth();
  const [backendStatus, setBackendStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [moviesInDB, setMoviesInDB] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    director: "",
    genre: "",
    description: "",
    posterUrl: "",
    duration: 120,
  });

  useEffect(() => {
    checkBackend();
    refreshMoviesList();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await api.get("/movies");
      setBackendStatus(true);
    } catch (error) {
      setBackendStatus(false);
    }
  };

  const refreshMoviesList = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/movies");
      const movies = response.data;
      setMoviesInDB(movies);
    } catch (error) {
      setMoviesInDB([]);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      releaseDate: "",
      director: "",
      genre: "",
      description: "",
      posterUrl: "",
      duration: 120,
    });
    setEditingMovie(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePosterUrl = (url) => {
    const MAX_URL_LENGTH = 255;
    if (url && url.length > MAX_URL_LENGTH) {
      return {
        valid: false,
        error: `Poster URL is too long (${url.length} characters). Maximum allowed is ${MAX_URL_LENGTH} characters.\n\nTip: Use direct image URLs instead of Google redirect URLs. Right-click the image and select "Copy image address".`,
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
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Check if user is authenticated and is admin
      if (!user.id) {
        alert("Please log in first");
        return;
      }

      if (user.role !== "ADMIN") {
        alert("Admin access required");
        return;
      }

      const url = API_BASE_URL + "/movies";

      // Backend model uses camelCase
      const movieData = {
        title: formData.title,
        releaseDate: formData.releaseDate,
        director: formData.director,
        genre: formData.genre,
        description: formData.description,
        posterUrl: formData.posterUrl,
        duration: formData.duration,
      };

      const headers = {
        "Content-Type": "application/json",
      };

      // Add token if available, otherwise try without (session-based)
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(movieData),
        credentials: "include", // Include cookies for session-based auth
      });

      if (response.ok) {
        alert("Movie created successfully!");
        resetForm();
        refreshMoviesList();
      } else {
        const error = await response.text();
        alert("Failed to create movie: " + error);
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      alert("Error creating movie");
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
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Check if user is authenticated and is admin
      if (!user.id) {
        alert("Please log in first");
        return;
      }

      if (user.role !== "ADMIN") {
        alert("Admin access required");
        return;
      }

      const url = API_BASE_URL + "/movies/" + editingMovie.id;

      // Backend model uses camelCase
      const movieData = {
        title: formData.title,
        releaseDate: formData.releaseDate,
        director: formData.director,
        genre: formData.genre,
        description: formData.description,
        posterUrl: formData.posterUrl,
        duration: formData.duration,
      };

      const headers = {
        "Content-Type": "application/json",
      };

      // Add token if available, otherwise try without (session-based)
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(movieData),
        credentials: "include",
      });

      if (response.ok) {
        alert("Movie updated successfully!");
        resetForm();
        refreshMoviesList();
      } else {
        const error = await response.text();
        alert("Failed to update movie: " + error);
      }
    } catch (error) {
      alert("Error updating movie");
    }
  };

  const handleEditClick = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || "",
      releaseDate: movie.releaseDate || "",
      director: movie.director || "",
      genre: movie.genre || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      duration: movie.duration || 120,
    });
    setShowForm(true);
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Check if user is authenticated and is admin
      if (!user.id) {
        alert("Please log in first");
        return;
      }

      if (user.role !== "ADMIN") {
        alert("Admin access required");
        return;
      }

      const url = API_BASE_URL + "/movies/" + id;

      const headers = {};

      // Add token if available, otherwise try without (session-based)
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: headers,
        credentials: "include", // Include cookies for session-based auth
      });

      if (response.ok) {
        alert("Movie deleted successfully!");
        refreshMoviesList();
      } else {
        const error = await response.text();
        alert("Failed to delete movie: " + error);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Error deleting movie");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="border-b-2 border-green-500 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="text-green-400">⚡</span> Admin Command Center
          </h1>
          <p className="text-green-300 text-lg">
            Manage your movie database with precision
          </p>
        </div>

        <div
          className={`mb-8 p-6 rounded-lg border-2 ${
            backendStatus
              ? "bg-gray-900 border-green-500 shadow-lg shadow-green-500/20"
              : "bg-gray-900 border-red-500 shadow-lg shadow-red-500/20"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                backendStatus ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            ></div>
            <p className="font-bold text-lg">
              Database Connection:{" "}
              <span
                className={backendStatus ? "text-green-400" : "text-red-400"}
              >
                {backendStatus === null
                  ? "⏳ Establishing Connection..."
                  : backendStatus
                  ? "🟢 ONLINE"
                  : "🔴 OFFLINE"}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-green-600 to-green-500 text-black font-bold px-8 py-3 rounded-lg hover:from-green-500 hover:to-green-400 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/25 border border-green-400"
          >
            {showForm ? "✖️ Cancel Operation" : "➕ Deploy New Movie"}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900 border-2 border-green-500 p-8 rounded-xl shadow-2xl shadow-green-500/10 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-green-400 flex items-center">
              <span className="mr-3">{editingMovie ? "⚙️" : "🚀"}</span>
              {editingMovie
                ? `Modify Movie Record - ${editingMovie.title}`
                : "Initialize New Movie Entry"}
            </h2>

            <form
              onSubmit={editingMovie ? handleUpdateMovie : handleCreateMovie}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-3 font-bold text-green-300 text-sm uppercase tracking-wide">
                    📽️ Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border-2 border-gray-600 text-white p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    placeholder="Enter movie title"
                  />
                </div>
                <div>
                  <label className="block mb-3 font-bold text-green-300 text-sm uppercase tracking-wide">
                    📅 Release Date *
                  </label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border-2 border-gray-600 text-white p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block mb-3 font-bold text-green-300 text-sm uppercase tracking-wide">
                    🎬 Director *
                  </label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border-2 border-gray-600 text-white p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    placeholder="Enter director name"
                  />
                </div>
                <div>
                  <label className="block mb-3 font-bold text-green-300 text-sm uppercase tracking-wide">
                    🎭 Genre *
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border-2 border-gray-600 text-white p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    placeholder="e.g., Action, Drama, Sci-Fi"
                  />
                </div>
                <div>
                  <label className="block mb-3 font-bold text-green-300 text-sm uppercase tracking-wide">
                    🖼️ Poster URL
                    {formData.posterUrl && (
                      <span
                        className={`ml-2 text-xs ${
                          formData.posterUrl.length > 255
                            ? "text-red-400 font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        ({formData.posterUrl.length}/255 characters)
                      </span>
                    )}
                  </label>
                  <input
                    type="url"
                    name="posterUrl"
                    value={formData.posterUrl}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border-2 p-3 rounded-lg text-white transition-all duration-200 ${
                      formData.posterUrl && formData.posterUrl.length > 255
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    }`}
                    placeholder="https://example.com/poster.jpg"
                  />
                  {formData.posterUrl && formData.posterUrl.length > 255 && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <span className="mr-2">⚠️</span>
                      URL too long! Use direct image URL. Right-click image →
                      "Copy image address"
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-3 font-bold text-green-300 text-sm uppercase tracking-wide">
                    ⏱️ Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border-2 border-gray-600 text-white p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    placeholder="120"
                    min="1"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-3 font-bold text-green-300 text-sm uppercase tracking-wide">
                  📝 Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-gray-800 border-2 border-gray-600 text-white p-3 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 resize-none"
                  placeholder="Enter detailed movie description..."
                />
              </div>
              <div className="flex gap-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-500 text-black font-bold px-8 py-3 rounded-lg hover:from-green-500 hover:to-green-400 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/25 border border-green-400"
                >
                  {editingMovie ? "💾 Execute Update" : "🚀 Deploy Movie"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-700 text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg border border-gray-500"
                >
                  ⏹️ Abort Mission
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-900 border-2 border-green-500 p-8 rounded-xl shadow-2xl shadow-green-500/10">
          <h2 className="text-3xl font-bold mb-6 text-green-400 flex items-center">
            <span className="mr-3">🗃️</span>
            Database Records ({moviesInDB.length} entries)
          </h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center text-green-400 text-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mr-4"></div>
                ⏳ Syncing database records...
              </div>
            </div>
          ) : moviesInDB.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl">No movies detected in database</p>
              <p className="text-sm mt-2">
                Deploy your first movie using the form above
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border-2 border-gray-700">
              <table className="w-full border-collapse bg-gray-800">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-green-500">
                    <th className="border-b-2 border-green-400 p-4 text-left text-black font-bold">
                      🆔 ID
                    </th>
                    <th className="border-b-2 border-green-400 p-4 text-left text-black font-bold">
                      🎬 Title
                    </th>
                    <th className="border-b-2 border-green-400 p-4 text-left text-black font-bold">
                      🎭 Director
                    </th>
                    <th className="border-b-2 border-green-400 p-4 text-left text-black font-bold">
                      📂 Genre
                    </th>
                    <th className="border-b-2 border-green-400 p-4 text-left text-black font-bold">
                      📅 Release
                    </th>
                    <th className="border-b-2 border-green-400 p-4 text-left text-black font-bold">
                      ⏱️ Duration
                    </th>
                    <th className="border-b-2 border-green-400 p-4 text-left text-black font-bold">
                      ⚙️ Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {moviesInDB.map((movie, index) => (
                    <tr
                      key={movie.id}
                      className="hover:bg-gray-700 transition-colors duration-150 border-b border-gray-700"
                    >
                      <td className="p-4 text-green-300 font-mono">
                        #{movie.id}
                      </td>
                      <td className="p-4 text-white font-bold">
                        {movie.title}
                      </td>
                      <td className="p-4 text-gray-300">{movie.director}</td>
                      <td className="p-4 text-gray-300">{movie.genre}</td>
                      <td className="p-4 text-gray-300">{movie.releaseDate}</td>
                      <td className="p-4 text-gray-300">
                        {movie.duration} min
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(movie)}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-blue-400 transform hover:scale-105 transition-all duration-200 text-sm font-bold shadow-lg shadow-blue-500/25 border border-blue-400 cursor-pointer"
                          >
                            ⚙️ Modify
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-red-400 transform hover:scale-105 transition-all duration-200 text-sm font-bold shadow-lg shadow-red-500/25 border border-red-400"
                          >
                            🗑️ Terminate
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
    </div>
  );
};

export default AdminPanel;
