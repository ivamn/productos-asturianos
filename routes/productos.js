/*
    Enrutador para los servicios de productos, exporta el enrutador para usarlo con el archivo principal.
*/

const express = require("express");
const multer = require('multer');
const auth = require(__dirname + '/../utils/auth.js');

const Producto = require(__dirname + "/../models/producto.js");
const Comentario = require(__dirname + "/../models/comentario.js");

const router = express.Router();
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})
let upload = multer({ storage: storage });

router.get("/", auth, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { productos: resultado })
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get("/productos/nuevo", auth, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos_form')
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get("/productos/editar/:id", auth, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('admin_productos_form', { producto: resultado })
        } else {
            res.render('admin_error', { error: 'Producto no encontrado' });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get("/productos/comentar/:id", auth, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('admin_productos_comment', { producto: resultado });
        } else {
            res.render('admin_error', { error: 'No se puede comentar en un producto no encontrado' });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

router.post("/productos", auth, upload.single('imagen'), (req, res) => {

    if (!req.body.nombre || !req.body.precio || !req.body.descripcion || !req.file) {
        res.render('admin_error', { error: 'Todos los campos son obligatorios' });
        return;
    }

    let nuevoProducto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        imagen: req.file.filename
    });

    nuevoProducto.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

router.put("/productos/:id", auth, upload.single('imagen'), (req, res) => {
    let newData = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion
    };

    if (req.file) {
        newData = { ...newData, imagen: req.file.filename };
    }

    Producto.findByIdAndUpdate(req.params.id, {
        $set: newData
    }, { new: true }).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

router.post("/comentarios/:idProducto", auth, (req, res) => {
    let nuevoComentario = new Comentario({
        nombredelusuario: req.session.usuario.login,
        comentario: req.body.comentario
    });

    nuevoComentario.save().then(comentario => {
        Producto.findByIdAndUpdate(req.params.idProducto, {
            $push: {
                comentarios: comentario
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error', { error: error });
        });
    }).catch(error => {
        res.render('admin_error', { error: error });
    });
});

router.delete("/productos/:id", auth, (req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

router.delete("/comentarios/:idProducto/:idComentario", auth, (req, res) => {
    Producto.findByIdAndUpdate(req.params.idProducto, {
        $pull: {
            comentarios: req.params.idComentario
        }
    }, { new: true }).then(resultado => {
        res.redirect('/admin/comentarios/' + req.params.idProducto);
    }).catch(error => {
        res.render('admin_error');
    });
});

module.exports = router;