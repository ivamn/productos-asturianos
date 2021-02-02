/*
    Arhivo de utilidad para generar usuarios con contraseña encriptada y no tener que hacer un registro.
*/

const bcrypt = require('bcrypt');

const Usuario = require(__dirname + '/../models/usuario');

Usuario.collection.drop();

const password1 = '12341234';
const password2 = '43214321';

const saltRounds = 10;

bcrypt.hash(password1, saltRounds, function (err, hash) {
    let usu1 = new Usuario({
        login: 'may123',
        password: hash
    });
    usu1.save();
});

bcrypt.hash(password2, saltRounds, function (err, hash) {
    let usu2 = new Usuario({
        login: 'nacho123',
        password: hash
    });
    usu2.save();
});