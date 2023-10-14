module.exports = {
    Admin:function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }

        req.flash('error_msg', 'Voce precisa esta logado para acessa essa rota')
        res.redirect('/')
    }
}