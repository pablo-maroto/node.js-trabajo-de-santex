const Library = require('../models/Library');
const Joi = require('joi');

const librarySchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  telefono: Joi.string().required()
});

// Función para crear una librería
exports.createLibrary = (req, res) => {
  // Validación de los datos de entrada
  const { error } = librarySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
};
const createLibrary = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { name, location, telefono } = req.body;
      const library = await Library.create({ name, location, telefono });
      res.status(201).json(library);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => ({ field: err.path, message: err.message }));
        res.status(400).json({ errors });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la librería' });
      }
    }
    res.status(401).json({ message: 'No estás autenticado' });
  }
};


// Obtener una librería por su ID
const getLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    const library = await Library.findByPk(id);
    if (library) {
      res.json(library);
    } else {
      res.status(404).json({ message: 'Librería no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la librería' });
  }
};

// Obtener todas las librerías
const getAllLibraries = async (req, res) => {
  try {
    const libraries = await Library.findAll();
    res.json(libraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las librerías' });
  }
};

// Actualizar una librería por su ID
const updateLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, telefono } = req.body;
    const library = await Library.findByPk(id);

    if (!library) {
      return res.status(404).json({ message: 'Librería no encontrada' });
    }

    library.name = name;
    library.location = location;
    library.telefono = telefono;

    await library.save();
    res.status(200).json(library);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => ({ field: err.path, message: err.message }));
      res.status(400).json({ errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la librería' });
    }
  }
};

// Eliminar una librería por su ID
const deleteLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    const library = await Library.findByPk(id);

    if (!library) {
      return res.status(404).json({ message: 'Librería no encontrada' });
    }

    // Realizar el borrado lógico
    library.deleted = true;
    await library.save();

    res.status(200).json({ message: 'Librería eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la librería' });
  }
};



module.exports = {
  createLibrary,
  getLibrary,
  getAllLibraries,
  updateLibrary,
  deleteLibrary,
};
