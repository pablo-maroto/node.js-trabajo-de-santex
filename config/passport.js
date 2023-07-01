const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Campo del formulario utilizado como nombre de usuario
    },
    async (email, password, done) => {
      try {
        // Buscar al usuario por correo electrónico
        const user = await User.findOne({ where: { email } });

        // Si el usuario no existe o la contraseña es incorrecta
        if (!user || !user.validPassword(password)) {
          return done(null, false, { message: 'Correo electrónico o contraseña incorrectos' });
        }

        // Autenticación exitosa
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serializar al usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar al usuario
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
