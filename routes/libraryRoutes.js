const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// Rutas para las librerías
router.post('/libraries', libraryController.createLibrary);
router.get('/libraries/:id', libraryController.getLibraryById);
router.get('/libraries', libraryController.getAllLibraries);
router.put('/libraries/:id', libraryController.updateLibraryById);
router.delete('/libraries/:id', libraryController.deleteLibraryById);

module.exports = router;
