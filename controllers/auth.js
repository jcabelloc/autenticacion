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
  Usuario.findById('66e8e9ae442a15f1a5280dad')
    .then(usuario => {
      req.session.autenticado = true;
      req.session.usuario = usuario;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postSalir = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};