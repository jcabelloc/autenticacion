const bcrypt = require('bcryptjs');

const Usuario = require("../models/usuario");


exports.getIngresar = (req, res, next) => {
  console.log(req.session.autenticado);
  res.render('auth/ingresar', {
    path: '/ingresar',
    titulo: 'Ingresar',
    autenticado: false
  });
};


exports.postIngresar = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Usuario.findOne({ email: email })
    .then(usuario => {
      if (!usuario) {
        return res.redirect('/ingresar');
      }
      bcrypt
        .compare(password, usuario.password)
        .then(hayCoincidencia => {
          if (hayCoincidencia) {
            req.session.autenticado = true;
            req.session.usuario = usuario;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/ingresar');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/ingresar');
        });
    })
    .catch(err => console.log(err));
};

exports.getRegistrarse = (req, res, next) => {
  res.render('auth/registrarse', {
    path: '/registrarse',
    titulo: 'Registrarse',
    autenticado: false
  });
};

exports.postRegistrarse = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmado = req.body.passwordConfirmado;
  Usuario.findOne({ email: email })
    .then(usuarioDoc => {
      if (usuarioDoc) {
        return res.redirect('/registrarse');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const usuario = new Usuario({
            email: email,
            password: hashedPassword,
            carrito: { items: [] }
          });
          return usuario.save();
        })
        .then(result => {
          res.redirect('/ingresar');
        });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postSalir = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};