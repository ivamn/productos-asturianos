/*
    Modelo y esquema de usuario.
*/

const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema({
    login: {
        type: String,
        minlength: 5,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    }
});

const Usuario = mongoose.model('usuario', usuariosSchema);

module.exports = Usuario;