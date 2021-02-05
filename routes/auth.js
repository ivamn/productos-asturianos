/*
    Enrutador para los servicios de usuarios, exporta el enrutador para usarlo con el archivo principal.
*/

const express = require("express");
const bcrypt = require('bcrypt');

const Usuario = require(__dirname + "/../models/usuario.js");

const router = express.Router();

router.get("/login", (req, res) => {
    res.render('auth_login');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/login', async (req, res) => {
    try {
        const resultado = await Usuario.findOne({ login: req.body.login });
        if (resultado) {
            const passwordOk = await bcrypt.compare(req.body.password, resultado.password);
            if (passwordOk) {
                req.session.usuario = resultado;
                res.redirect('/admin');
            } else {
                res.render('auth_login',
                    { error: "Usuario o contraseña incorrectos" });
            }
        } else {
            res.render('auth_login',
                { error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.render('auth_login');
    }
});

module.exports = router;