CREATE DATABASE IF NOT EXISTS db_leitor_critico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

use db_leitor_critico;

CREATE TABLE IF NOT EXISTS
    usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        cargo VARCHAR(15) NOT NULL DEFAULT 'usuarioComum',
        redeSocial VARCHAR(100)
    );

CREATE TABLE
    livros (
        id_livro INT AUTO_INCREMENT PRIMARY KEY,
        id_google VARCHAR(50) UNIQUE,
        titulo VARCHAR(255) NOT NULL,
        subtitulo VARCHAR(255),
        descricao TEXT,
        data_publicacao DATE,
        editora VARCHAR(255),
        idioma VARCHAR(10),
        numero_paginas INT,
        categoria_principal VARCHAR(100),
        media_avaliacao DECIMAL(2, 1),
        qtd_avaliacoes INT,
        link_previa VARCHAR(500),
        link_imagem VARCHAR(500)
    );

CREATE TABLE
    autores (
        id_autor INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
    );

CREATE TABLE
    livros_autores (
        id_livro INT,
        id_autor INT,
        PRIMARY KEY (id_livro, id_autor),
        FOREIGN KEY (id_livro) REFERENCES livros (id_livro) ON DELETE CASCADE,
        FOREIGN KEY (id_autor) REFERENCES autores (id_autor) ON DELETE CASCADE
    );

CREATE TABLE
    categorias (
        id_categoria INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
    );

CREATE TABLE
    livros_categorias (
        id_livro INT,
        id_categoria INT,
        PRIMARY KEY (id_livro, id_categoria),
        FOREIGN KEY (id_livro) REFERENCES livros (id_livro) ON DELETE CASCADE,
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria) ON DELETE CASCADE
    );

CREATE TABLE
    isbns (
        id_isbn INT AUTO_INCREMENT PRIMARY KEY,
        isbn_10 VARCHAR(20),
        isbn_13 VARCHAR(20),
        id_livro INT,
        FOREIGN KEY (id_livro) REFERENCES livros (id_livro) ON DELETE CASCADE
    );

CREATE TABLE
    categorias_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        id_livro INT NOT NULL,
        FOREIGN KEY (id_livro) REFERENCES livros (id_livro) ON DELETE CASCADE
    );