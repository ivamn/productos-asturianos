/*
    Ejercicio de desarrollo de una web completa con Express, sobre la base de datos
    de "productos". Se definirán distintas
    vistas en Nunjucks para mostrar información de los productos y poderlos
    insertar, borrar, etc.
*/

const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const session = require('express-session');

const admin = require(__dirname + '/routes/productos');
const publico = require(__dirname + '/routes/publico');
const auth = require(__dirname + '/routes/auth');

mongoose.connect('mongodb://localhost:27017/prodAsturianosV3',
    { useNewUrlParser: true });

let app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');

app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride('_method'));

app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

require(__dirname + '/utils/generar_usuarios.js');

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use('/', publico);
app.use('/auth', auth);
app.use('/admin', admin);

app.listen(8080);