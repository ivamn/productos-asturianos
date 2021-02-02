/*
    Archivo que exporta un middleware que comprueba que haya un usuario identificado en el sistema.
*/

const auth = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.render('auth_login');
};

module.exports = auth;