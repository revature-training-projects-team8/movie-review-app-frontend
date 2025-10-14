-- ===========================================
-- SQL Script to Insert 12 Movies into Database
-- ===========================================
-- Database: movies
-- Table: movies
-- Run this script in MySQL command line or MySQL Workbench
-- ===========================================

USE movies;

-- Clear existing movies (optional - remove if you want to keep existing data)
-- DELETE FROM movies;
-- ALTER TABLE movies AUTO_INCREMENT = 1;

-- Insert 12 Movies
INSERT INTO movies (title, release_date, director, genre, description, poster_url, duration) VALUES

-- Movie 1: Superman
('Superman', 
 '2025-07-11', 
 'James Gunn', 
 'Action, Sci-Fi, Adventure', 
 'Superman faces unintended consequences after he intervenes in an international conflict orchestrated by billionaire Lex Luthor.', 
 'https://images.unsplash.com/photo-1578946956517-f4ac31b16b6a?w=300&h=450&fit=crop&ixlib=rb-4.0.3', 
 145),

-- Movie 2: One Battle After Another
('One Battle After Another', 
 '2025-09-26', 
 'Paul Thomas Anderson', 
 'Drama, Action, Crime, Thriller', 
 'Washed-up revolutionary Bob (Leonardo DiCaprio) exists in a state of stoned paranoia, surviving off-grid with his spirited, self-reliant daughter, Willa. When his evil nemesis resurfaces after 16 years and she goes missing, the former radical scrambles to find her, father and daughter both battling the consequences of his past.', 
 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop', 
 135),

-- Movie 3: The Batman
('The Batman', 
 '2022-03-04', 
 'Matt Reeves', 
 'Action, Crime, Drama, Psychological Thriller', 
 'Batman, in his second year fighting crime in Gotham City, uncovers corruption with ties to his own family while pursuing the Riddler, a mysterious serial killer targeting the city''s elite.', 
 'https://images.unsplash.com/photo-1489599558687-b332130f6b73?w=300&h=450&fit=crop', 
 176),

-- Movie 4: Frankenstein
('Frankenstein', 
 '2025-10-17', 
 'Guillermo del Toro', 
 'Drama, Horror, Science Fiction', 
 'Oscar-winning director Guillermo del Toro adapts Mary Shelley''s classic tale of Victor Frankenstein, a brilliant but egotistical scientist who brings a creature to life in a monstrous experiment that ultimately leads to the undoing of both the creator and his tragic creation.', 
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop', 
 140),

-- Movie 5: Tron: Ares
('Tron: Ares', 
 '2025-10-10', 
 'Joachim Rønning', 
 'Cyberpunk, Action, Sci-Fi', 
 'A highly sophisticated Program, Ares, is sent from the digital world into the real world on a dangerous mission.', 
 'https://artofthemovies.co.uk/products/tron-ares-2025-ds-os-teaser-01', 
 120),

-- Movie 6: The Fantastic Four: First Steps
('The Fantastic Four: First Steps', 
 '2025-07-25', 
 'Matt Shakman', 
 'Action, Adventure, Science Fiction', 
 'Set against the vibrant backdrop of a 1960s-inspired, retro-futuristic world, Marvel Studios'' "The Fantastic Four: First Steps" introduces Marvel''s First Family as they face their most daunting challenge yet.', 
 'https://artofthemovies.co.uk/products/the-fantastic-four-first-steps-2025-ds-os-familyphoto-01', 
 120),

-- Movie 7: Weapons
('Weapons', 
 '2025-08-08', 
 'Zach Cregger', 
 'Mystery, Horror', 
 'At exactly 02:17 in the morning, every kid in Mrs. Gandy''s class wakes up and goes for a late night wander, vanishing into the dark.', 
 'https://www.ebay.com/itm/406142898267', 
 120),

-- Movie 8: Oppenheimer
('Oppenheimer', 
 '2023-07-21', 
 'Christopher Nolan', 
 'Biography, Drama, History', 
 'A dramatization of the life story of J. Robert Oppenheimer, the American theoretical physicist who helped develop the first nuclear weapons during World War II.', 
 'https://artofthemovies.co.uk/products/oppenheimer-2023-ds-os-watchingexplosion-01', 
 120),

-- Movie 9: Deadpool & Wolverine
('Deadpool & Wolverine', 
 '2024-07-26', 
 'Shawn Levy', 
 'Action, Sci-Fi, Comedy, Superhero', 
 'Deadpool works with a reluctant Wolverine from another universe to stop the Time Variance Authority (TVA) from destroying his own universe.', 
 'http://www.impawards.com/2024/deadpool_and_wolverine.html', 
 120),

-- Movie 10: The Smashing Machine
('The Smashing Machine', 
 '2025-10-03', 
 'Benny Safdie', 
 'Action, Biography, Drama, History, Sport', 
 'In the late 1990s, up-and-coming mixed martial artist Mark Kerr aspires to become the greatest fighter in the world. However, he must also battle his opioid dependence and a volatile relationship with his girlfriend Dawn.', 
 'https://www.moviefone.com/movie/smashing-machine/8jH7gGMxW2irGDKhPkRnC1/where-to-watch/', 
 120),

-- Movie 11: The Conjuring: Last Rites
('The Conjuring: Last Rites', 
 '2025-09-05', 
 'Michael Chaves', 
 'Supernatural Horror', 
 'The film is based on the real-life investigations of the Smurl haunting case, featuring Ed and Lorraine Warren.', 
 'https://www.fandango.com/the-conjuring-last-rites-2025-242168/movie-photos-posters', 
 120),

-- Movie 12: Thunderbolts*
('Thunderbolts*', 
 '2025-05-02', 
 'Jake Schreier', 
 'Action, Superhero, Fantasy', 
 'A group of supervillains are recruited to go on missions for the government.', 
 'https://en.wikipedia.org/wiki/Thunderbolts*', 
 120);

-- ===========================================
-- Verify the insert
-- ===========================================

-- Check total count
SELECT COUNT(*) as total_movies FROM movies;

-- View all movies
SELECT id, title, release_date, director, genre, duration FROM movies;

-- View first 5 movies
SELECT * FROM movies LIMIT 5;

-- ===========================================
-- Expected Output:
-- total_movies: 12
-- All 12 movies should be displayed with their details
-- ===========================================
