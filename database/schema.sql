CREATE DATABASE IF NOT EXISTS cineby_clone;
USE cineby_clone;

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE movies (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    poster_url VARCHAR(255),
    banner_url VARCHAR(255),
    release_year INT,
    rating DECIMAL(3,1),
    duration VARCHAR(20),
    release_date DATE,
    trending BOOLEAN DEFAULT FALSE,
    latest BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movie_genres (
    movie_id VARCHAR(50),
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE video_sources (
    id VARCHAR(50) PRIMARY KEY,
    movie_id VARCHAR(50),
    server_name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    quality VARCHAR(20),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
