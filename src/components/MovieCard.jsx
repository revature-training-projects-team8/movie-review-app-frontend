import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, Film } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get first genre if multiple genres are present
  const primaryGenre = movie.genre ? movie.genre.split(',')[0].trim() : 'Unknown';

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in group flex flex-col h-full"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden h-96">
        {!imageError && movie.posterUrl ? (
          <img 
            src={movie.posterUrl} 
            alt={movie.title + ' Poster'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-white text-center p-6">
            <div>
              <Film className="w-16 h-16 mx-auto mb-3 opacity-80" />
              <div className="text-2xl font-bold mb-2">{movie.title}</div>
              <div className="text-sm opacity-80">{primaryGenre}</div>
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg flex items-center shadow-lg">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1.5" />
          <span className="text-sm font-bold">{movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <h3 className="text-white font-bold text-xl mb-2">{movie.title}</h3>
            <div className="flex items-center text-gray-200 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              {movie.duration && (
                <>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{movie.duration} min</span>
                </>
              )}
            </div>
            <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {movie.description}
            </p>
          </div>
        </div>

        {/* Bottom Title Bar (visible by default) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-white font-bold text-lg truncate">{movie.title}</h3>
          <div className="flex items-center text-gray-300 text-sm mt-1">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
            {movie.duration && (
              <>
                <span className="mx-2">•</span>
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{movie.duration}min</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4 bg-gradient-to-b from-white to-gray-50 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {primaryGenre}
          </span>
          <span className="text-gray-600 text-sm font-medium truncate ml-2">{movie.director}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed flex-grow">
          {movie.description}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-200">
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center">
            View Details 
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;