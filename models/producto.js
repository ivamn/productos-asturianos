/*
    Modelo y esquema de producto.
*/

const mongoose = require("mongoose");

let productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        min: 1,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: { type: String },
    comentarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comentario'
    }]
});

let Producto = mongoose.model('producto', productoSchema);

module.exports = Producto;