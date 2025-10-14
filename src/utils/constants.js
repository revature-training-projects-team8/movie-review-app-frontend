// --- Configuration and Constants ---
export const API_BASE_URL = "http://localhost:8080"; // Backend API URL

// Real Movie Data for Database Initialization
export const REAL_MOVIES_DATA = [
  {
    title: "Superman",
    releaseDate: "July 11, 2025",
    director: "James Gunn",
    genre: "Action, Sci-Fi, Adventure",
    description:
      "Superman faces unintended consequences after he intervenes in an international conflict orchestrated by billionaire Lex Luthor.",
    posterUrl:
      "https://images.unsplash.com/photo-1578946956517-f4ac31b16b6a?w=300&h=450&fit=crop&ixlib=rb-4.0.3",
    duration: 145,
  },
  {
    id: 2,
    title: "One Battle After Another",
    releaseDate: "September 26, 2025",
    director: "Paul Thomas Anderson",
    genre: "Drama, Action, Crime, Thriller",
    avgRating: 4.0,
    description:
      "Washed-up revolutionary Bob (Leonardo DiCaprio) exists in a state of stoned paranoia, surviving off-grid with his spirited, self-reliant daughter, Willa. When his evil nemesis resurfaces after 16 years and she goes missing, the former radical scrambles to find her, father and daughter both battling the consequences of his past.",
    posterUrl:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    duration: 135,
  },
  {
    id: 3,
    title: "The Batman",
    releaseDate: "March 4, 2022",
    director: "Matt Reeves",
    genre: "Action, Crime, Drama, Psychological Thriller",
    avgRating: 4.6,
    description:
      "Batman, in his second year fighting crime in Gotham City, uncovers corruption with ties to his own family while pursuing the Riddler, a mysterious serial killer targeting the city's elite.",
    posterUrl:
      "https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop",
    duration: 176,
  },
  {
    id: 4,
    title: "Frankenstein",
    releaseDate: "October 17, 2025",
    director: "Guillermo del Toro",
    genre: "Drama, Horror, Science Fiction",
    avgRating: 4.3,
    description:
      "Oscar-winning director Guillermo del Toro adapts Mary Shelley's classic tale of Victor Frankenstein, a brilliant but egotistical scientist who brings a creature to life in a monstrous experiment that ultimately leads to the undoing of both the creator and his tragic creation.",
    posterUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    duration: 140,
  },
  {
    title: "Tron: Ares",
    releaseDate: "October 10, 2025",
    director: "Joachim Rønning",
    genre: "Cyberpunk, Action, Sci-Fi",
    description:
      "A highly sophisticated Program, Ares, is sent from the digital world into the real world on a dangerous mission.",
    posterUrl:
      "https://artofthemovies.co.uk/products/tron-ares-2025-ds-os-teaser-01",
  },
  {
    title: "The Fantastic Four: First Steps",
    releaseDate: "July 25, 2025",
    director: "Matt Shakman",
    genre: "Action, Adventure, Science Fiction",
    description:
      "Set against the vibrant backdrop of a 1960s-inspired, retro-futuristic world, Marvel Studios’ “The Fantastic Four: First Steps” introduces Marvel's First Family as they face their most daunting challenge yet.",
    posterUrl:
      "https://artofthemovies.co.uk/products/the-fantastic-four-first-steps-2025-ds-os-familyphoto-01",
  },
  {
    title: "Weapons",
    releaseDate: "August 8, 2025",
    director: "Zach Cregger",
    genre: "Mystery, Horror",
    description:
      "At exactly 02:17 in the morning, every kid in Mrs. Gandy's class wakes up and goes for a late night wander, vanishing into the dark.",
    posterUrl: "https://www.ebay.com/itm/406142898267",
  },
  {
    title: "Oppenheimer",
    releaseDate: "July 21, 2023",
    director: "Christopher Nolan",
    genre: "Biography, Drama, History",
    description:
      "A dramatization of the life story of J. Robert Oppenheimer, the American theoretical physicist who helped develop the first nuclear weapons during World War II.",
    posterUrl:
      "https://artofthemovies.co.uk/products/oppenheimer-2023-ds-os-watchingexplosion-01",
  },
  {
    title: "Deadpool & Wolverine",
    releaseDate: "July 26, 2024",
    director: "Shawn Levy",
    genre: "Action, Sci-Fi, Comedy, Superhero",
    description:
      "Deadpool works with a reluctant Wolverine from another universe to stop the Time Variance Authority (TVA) from destroying his own universe.",
    posterUrl: "http://www.impawards.com/2024/deadpool_and_wolverine.html",
  },
  {
    title: "The Smashing Machine",
    releaseDate: "October 3, 2025",
    director: "Benny Safdie",
    genre: "Action, Biography, Drama, History, Sport",
    description:
      "In the late 1990s, up-and-coming mixed martial artist Mark Kerr aspires to become the greatest fighter in the world. However, he must also battle his opioid dependence and a volatile relationship with his girlfriend Dawn.",
    posterUrl:
      "https://www.moviefone.com/movie/smashing-machine/8jH7gGMxW2irGDKhPkRnC1/where-to-watch/",
  },
  {
    title: "The Conjuring: Last Rites",
    releaseDate: "September 5, 2025",
    director: "Michael Chaves",
    genre: "Supernatural Horror",
    description:
      "The film is based on the real-life investigations of the Smurl haunting case, featuring Ed and Lorraine Warren.",
    posterUrl:
      "https://www.fandango.com/the-conjuring-last-rites-2025-242168/movie-photos-posters",
  },
  {
    title: "Thunderbolts*",
    releaseDate: "May 2, 2025",
    director: "Jake Schreier",
    genre: "Action, Superhero, Fantasy",
    description:
      "A group of supervillains are recruited to go on missions for the government.",
    posterUrl: "https://en.wikipedia.org/wiki/Thunderbolts*",
  },
];

export const MOCK_REVIEWS = [
  {
    id: 101,
    username: "moviebuff23",
    rating: 5,
    comment:
      "An absolute masterpiece! The storytelling is phenomenal and the character development is second to none.",
    movieId: 1,
    userId: 1,
    createdAt: "2024-01-15",
  },
  {
    id: 102,
    username: "cinephile_jane",
    rating: 4,
    comment:
      "Great cinematography and powerful performances. A must-watch classic.",
    movieId: 1,
    userId: 2,
    createdAt: "2024-01-20",
  },
  {
    id: 103,
    username: "film_critic",
    rating: 5,
    comment:
      "Coppola's direction is flawless. One of the greatest films ever made.",
    movieId: 2,
    userId: 3,
    createdAt: "2024-02-01",
  },
  {
    id: 104,
    username: "action_lover",
    rating: 5,
    comment:
      "Heath Ledger's Joker is iconic. This movie redefined superhero films.",
    movieId: 4,
    userId: 4,
    createdAt: "2024-02-10",
  },
];

// Function to load movies from JSON file
export const loadMoviesFromJSON = async () => {
  try {
    const response = await fetch("/movieData.json");
    const data = await response.json();
    return {
      movies: data.movies || REAL_MOVIES_DATA,
      reviews: data.reviews || MOCK_REVIEWS,
    };
  } catch (error) {
    console.error("Error loading movie data from JSON:", error);
    return {
      movies: REAL_MOVIES_DATA,
      reviews: MOCK_REVIEWS,
    };
  }
};

// Function to initialize movies in the database
export const initializeMoviesInDB = async () => {
  try {
    console.log("Initializing movies in database...");

    // Movie poster image URLs - using diverse cinematic images
    const moviePosters = [
      "https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop", // Superman - action/hero
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", // Drama
      "https://images.unsplash.com/photo-1518639192441-8fce0c83b5d6?w=300&h=450&fit=crop", // Batman - dark/action
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop", // Horror
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop", // Sci-fi
      "https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop", // Adventure
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", // Mystery
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop", // Biography
      "https://images.unsplash.com/photo-1518639192441-8fce0c83b5d6?w=300&h=450&fit=crop", // Comedy/Action
      "https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop", // Sport
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop", // Horror
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", // Superhero
    ];

    // Add IDs to movies that don't have them and ensure consistent format
    const moviesWithIds = REAL_MOVIES_DATA.map((movie, index) => ({
      ...movie,
      id: movie.id || index + 1,
      avgRating: movie.avgRating || 0,
      duration: movie.duration || 120,
      posterUrl: moviePosters[index] || moviePosters[0],
    }));

    // Try to save movies to backend database
    const response = await fetch(`${API_BASE_URL}/movies/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moviesWithIds),
    });

    if (response.ok) {
      console.log("Movies successfully saved to database!");
      return await response.json();
    } else {
      console.warn("Backend not available, using local data");
      return moviesWithIds;
    }
  } catch (error) {
    console.warn(
      "Could not connect to backend, using local movie data:",
      error.message
    );
    // Return formatted movies even if backend is not available
    return REAL_MOVIES_DATA.map((movie, index) => ({
      ...movie,
      id: movie.id || index + 1,
      avgRating: movie.avgRating || 0,
      duration: movie.duration || 120,
      posterUrl: `https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop&seed=${index}`,
    }));
  }
};

// Function to get all movies (from DB or fallback to local)
export const getAllMovies = async () => {
  try {
    // First try to get from backend
    const response = await fetch(`${API_BASE_URL}/movies`);
    if (response.ok) {
      const movies = await response.json();
      console.log("Movies loaded from database");
      return movies;
    }
  } catch (error) {
    console.warn("Backend not available, using local data");
  }

  // Movie poster image URLs - using diverse cinematic images
  const moviePosters = [
    "https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop", // Superman - action/hero
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", // Drama
    "https://images.unsplash.com/photo-1518639192441-8fce0c83b5d6?w=300&h=450&fit=crop", // Batman - dark/action
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop", // Horror
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop", // Sci-fi
    "https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop", // Adventure
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", // Mystery
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop", // Biography
    "https://images.unsplash.com/photo-1518639192441-8fce0c83b5d6?w=300&h=450&fit=crop", // Comedy/Action
    "https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop", // Sport
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop", // Horror
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", // Superhero
  ];

  // Fallback to local data with proper formatting
  return REAL_MOVIES_DATA.map((movie, index) => ({
    ...movie,
    id: movie.id || index + 1,
    avgRating: movie.avgRating || 0,
    duration: movie.duration || 120,
    posterUrl: moviePosters[index] || moviePosters[0],
  }));
};

// ===== ADMIN FUNCTIONS FOR DATABASE INITIALIZATION =====

// Admin function to save all movies to the database
export const adminSaveAllMoviesToDB = async () => {
  const results = {
    success: [],
    failed: [],
    totalMovies: REAL_MOVIES_DATA.length,
  };

  console.log(
    `🎬 Starting to save ${REAL_MOVIES_DATA.length} movies to database...`
  );

  // Get authentication token from localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    console.error(
      "❌ No authentication token found! Please login as admin first."
    );
    return {
      ...results,
      error: "Not authenticated. Please login as admin first.",
    };
  }

  for (let i = 0; i < REAL_MOVIES_DATA.length; i++) {
    const movie = REAL_MOVIES_DATA[i];
    try {
      // Extract year from releaseDate string (e.g., "July 11, 2025" -> 2025)
      const yearMatch = movie.releaseDate?.match(/\d{4}/);
      const releaseYear = yearMatch
        ? parseInt(yearMatch[0])
        : new Date().getFullYear();

      const response = await fetch(`${API_BASE_URL}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add JWT token for authentication
        },
        body: JSON.stringify({
          title: movie.title,
          releaseYear: releaseYear, // Changed from releaseDate to releaseYear
          director: movie.director,
          genre: movie.genre,
          description: movie.description,
          posterUrl: movie.posterUrl,
          duration: movie.duration || 120, // Default duration if missing
        }),
      });

      if (response.ok) {
        const savedMovie = await response.json();
        results.success.push({ movie: movie.title, id: savedMovie.id });
        console.log(
          `✅ Successfully saved: ${movie.title} (ID: ${savedMovie.id})`
        );
      } else {
        const errorText = await response.text();
        results.failed.push({ movie: movie.title, error: errorText });
        console.error(`❌ Failed to save: ${movie.title} - ${errorText}`);
      }
    } catch (error) {
      results.failed.push({ movie: movie.title, error: error.message });
      console.error(`❌ Error saving ${movie.title}:`, error.message);
    }
  }

  console.log(`🎯 Database initialization complete!`);
  console.log(`✅ Successfully saved: ${results.success.length} movies`);
  console.log(`❌ Failed to save: ${results.failed.length} movies`);

  return results;
};

// Function to get all movies from the real database
export const getAllMoviesFromDB = async () => {
  try {
    console.log("🎬 Fetching movies from database...");
    const response = await fetch(`${API_BASE_URL}/movies`);

    if (response.ok) {
      const movies = await response.json();
      console.log(
        `✅ Successfully loaded ${movies.length} movies from database`
      );
      return movies;
    } else {
      throw new Error(
        `Failed to fetch movies: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("❌ Error fetching movies from database:", error.message);
    console.log(
      "🔄 Backend might not be running. Make sure your Spring Boot server is running on localhost:8080"
    );
    throw error;
  }
};

// Function to check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.log("🔄 Backend not available:", error.message);
    return false;
  }
};
