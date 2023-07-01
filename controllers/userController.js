const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.create({ name, password });
    res.status(201).json(user);
    if (user) {
        res.status(201).json(user);
      } else {
        res.status(400).json({ message: 'Datos inválidos' });
      }
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};


// Función para autenticar y manejar el inicio de sesión
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      // En caso de error, devolver el error al cliente
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    if (!user) {
      // Si no se encuentra al usuario, devolver mensaje de error de autenticación
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // Si se encuentra al usuario, iniciar sesión manualmente
    req.login(user, (err) => {
      if (err) {
        // En caso de error, devolver el error al cliente
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      // Si la autenticación es exitosa, devolver el usuario autenticado
      return res.status(200).json({ message: 'Autenticación exitosa' });
    });
  })(req, res, next);
};
module.exports = {
  createUser
};

// Ruta de login
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Inicio de sesión exitoso' });
    });
  })(req, res, next);
};


// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Generar el hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Guardar el usuario en la base de datos con la contraseña hasheada
    const newUser = await User.create({ name, password: hashedPassword });
   

    // Genera token de sesión para el usuario
    const token = generateToken(newUser.id);

    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

// Función para manejar el inicio de sesión
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Buscar al usuario en la base de datos por su nombre
    const user = await User.findOne({ where: { name } });
  

    // Verifica si el usuario existe
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Genera token de sesión para el usuario
    const token = generateToken(user.id);

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// Función para generar un token JWT
function generateToken(userId) {
  const secretKey = '1234'; 
  const expiresIn = '1h'; // Duración del token

  const payload = { userId };

  return jwt.sign(payload, secretKey, { expiresIn });
}
