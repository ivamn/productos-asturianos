/*
    Enrutador para los servicios públicos, exporta el enrutador para usarlo con el archivo principal.
*/

const express = require("express");

const Producto = require(__dirname + "/../models/producto.js");
const Comentario = require(__dirname + "/../models/comentario.js");

const router = express.Router();

router.get("/", (req, res) => {
    Producto.find().then(resultado => {
        res.render('publico_index', { productos: resultado });
    }).catch(error => {
        res.render('publico_error')
    });
});

router.get("/buscar", (req, res) => {
    Producto.find({ nombre: { $regex: req.query.q, $options: "i" } }).then(resultado => {
        if (resultado && resultado.length) {
            res.render('publico_index', { productos: resultado });
        } else {
            res.render('publico_index', { error: 'No se encontraron resultados' });
        }
    }).catch(error => {
        res.render('publico_error');
    });
});

router.get("/producto/:id", async (req, res) => {
    try {
        const resultado = await Producto.findById(req.params.id);
        if (resultado) {
            const comentarios = [];
            if (resultado.comentarios) {
                for (let comentario of resultado.comentarios) {
                    comentarios.push(await Comentario.findById(comentario));
                }
            }
            res.render('publico_producto', { producto: resultado, comentarios: comentarios });
        } else {
            res.render('publico_error', { error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.render('publico_error');
    }
});

module.exports = router;