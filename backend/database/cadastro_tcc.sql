CREATE DATABASE IF NOT EXISTS cadastro_tcc
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

use cadastro_tcc;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('leitor', 'critico') NOT NULL
);
