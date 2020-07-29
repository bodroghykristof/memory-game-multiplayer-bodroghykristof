DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id serial NOT NULL,
    username text,
    hashed_password text
);

DROP TABLE IF EXISTS rooms;

CREATE TABLE rooms (
    id serial NOT NULL,
    user_id_one integer,
    username_one text,
    user_id_two integer,
    username_two text
);