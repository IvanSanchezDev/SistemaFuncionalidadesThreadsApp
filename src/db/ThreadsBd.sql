CREATE DATABASE threadsDb;

USE threadsDb;

CREATE TABLE users(
user_id int NOT NULL AUTO_INCREMENT,
email varchar(100) NOT NULL,
username varchar(50) NOT NULL,
password varchar(255) NOT NULL,
detalles varchar(200) NULL,
telefono float NULL,
codigoPostal int null,
privateProfile int,
PRIMARY KEY(user_id)
);


CREATE TABLE posts(
post_id int NOT NULL AUTO_INCREMENT,
user_id int NOT NULL,
description text NOT NULL,
media text NOT NULL,
PRIMARY KEY(post_id),
FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE likes(
id int NOT NULL AUTO_INCREMENT COMMENT 'primary key',
post_id int NOT NULL,
user_id int NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(post_id) REFERENCES posts(post_id),
FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE comments(
id INT NOT NULL AUTO_INCREMENT,
comment varchar(250) NOT NULL,
post_id int NOT NULL,
user_id int NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(post_id) REFERENCES posts(post_id),
FOREIGN KEY(user_id) REFERENCES users(user_id)
)

