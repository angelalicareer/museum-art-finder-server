CREATE DATABASE museum_db;
\c museum_db

CREATE TABLE favorites(
  id SERIAL PRIMARY KEY,
  userId INT,
  objectId INT
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name  TEXT,
  email TEXT,
  password_digest TEXT
);
