const path = require('path');

const express = require('express');

const raizDir = require('./utils/path');

const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const Usuario = require('./models/usuario');


const MONGODB_URI = 'mongodb+srv://jcabelloc:secreto@cluster0.dm3fg.mongodb.net/tiendaonline?retryWrites=true&w=majority&appName=Cluster0';

const adminRoutes = require('./routes/admin');
const tiendaRoutes = require('./routes/tienda');
const authRoutes = require('./routes/auth');


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(raizDir, 'public')));
app.use(session({ secret: 'algo muy secreto', resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
  if (!req.session.usuario) {
    return next();
  }
  Usuario.findById(req.session.usuario._id)
    .then(usuario => {
      req.usuario = usuario;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(tiendaRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    Usuario.findOne().then(usuario => {
      if (!usuario) {
        const usuario = new Usuario({
          nombre: 'Juan',
          email: 'juan@gmail.com',
          carrito: {
            items: []
          }
        });
        usuario.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });



