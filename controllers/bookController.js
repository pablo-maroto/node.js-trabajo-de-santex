const Book = require('../models/Book');
const Joi = require('joi');

const bookSchema = Joi.object({
  isbn: Joi.number().required(),
  titulo: Joi.string().required(),
  autor: Joi.string().required(),
  year: Joi.string().required(),
  library: Joi.number().required()
});


// Función para crear un libro
exports.createBook = (req, res) => {
  // Validación de los datos de entrada
  const { error } = bookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
};

// Crear un libro
const createBook = async (req, res) => {
  try {
    const { isbn, titulo, autor, year, libraryId } = req.body;
    const book = await Book.create({ isbn, titulo, autor, year, libraryId });
    res.status(201).json(book);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => ({ field: err.path, message: err.message }));
      res.status(400).json({ errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el libro' });
    }
  }
};

// Obtener un libro por su ID
const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el libro' });
  }
};

// Obtener todos los libros
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los libros' });
  }
};

// Actualizar un libro por su ID
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { isbn, titulo, autor, year, libraryId } = req.body;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    book.isbn = isbn;
    book.titulo = titulo;
    book.autor = autor;
    book.year = year;
    book.libraryId = libraryId;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => ({ field: err.path, message: err.message }));
      res.status(400).json({ errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el libro' });
    }
  }
};

// Eliminar un libro por su ID
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Realizar el borrado lógico
    book.deleted = true;
    await book.save();

    res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el libro' });
  }
};

module.exports = {
  createBook,
  getBook,
  getAllBooks,
  updateBook,
  deleteBook,
};
