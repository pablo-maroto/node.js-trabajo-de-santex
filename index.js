const userController = require('./controllers/userController');
const User = require('./models/user');
const express = require('express');
const libraryRoutes = require('./routes/libraryRoutes');
const bookRoutes = require('./routes/bookRoutes');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();
app.post('/login', userController.login);
app.use('/library', libraryRoutes);
app.use('/book', bookRoutes);

passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ where: { username: username } })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        if (user.password !== password) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
      })
      .catch((err) => done(err));
  })
);
  
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  const port = 3000;
  
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { name: username } });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
  
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
  
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  

  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Inicio de sesión exitoso' });
  });
  


  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'No autorizado' });
  }
  
  app.get('/protected-route', ensureAuthenticated, (req, res) => {
    res.json({ message: 'Ruta protegida' });
  });
  

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Buscar al usuario en la base de datos por su nombre
      const user = await User.findOne({ where: { name: username } });

      // Si el usuario no existe, retornar mensaje de error
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      // Comparar la contraseña ingresada con la almacenada en la base de datos
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Si la contraseña es válida, retornar el usuario autenticado
      if (isPasswordValid) {
        return done(null, user);
      } else {
        // Si la contraseña no es válida, retornar mensaje de error
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      // En caso de error, retornar el error
      return done(error);
    }
  }
));

app.post('/login', passport.authenticate('local'), (req, res) => {
  // Si la autenticación es exitosa, se ejecutará esta función
  res.status(200).json({ message: 'Autenticación exitosa' });
});

// Configura el middleware de sesión
app.use(
  session({
    secret: '', // Clave secreta para firmar las cookies de sesión
    resave: false,
    saveUninitialized: false,
  })
);

// Configurar el middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar las rutas
app.use('/api', libraryRoutes);
app.use('/api', bookRoutes);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
