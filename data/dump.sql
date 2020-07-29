DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id serial NOT NULL,
    username text,
    hashed_password text
);