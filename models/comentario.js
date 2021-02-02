/*
    Modelo y esquema de comentario.
*/

const mongoose = require("mongoose");

let comentarioSchema = new mongoose.Schema({
    nombredelusuario: {
        type: String,
        required: true
    },
    comentario: {
        type: String,
        minlength: 5,
        required: true
    }
});

let Comentario = mongoose.model('comentario', comentarioSchema);

module.exports = Comentario;