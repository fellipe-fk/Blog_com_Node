//exportando modulos
    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    require('../models/Usuarios')
    const Usuario = mongoose.model('usuarios')
    const bcrypt = require('bcryptjs')
    const passport = require('passport')

//

//exportando validaçoes
    const validaCadastroUsuario = require('./errosRoutes/validaUsuarios/validaCadastroUsuario')


router.get('/cadastro', (req, res) => {
    res.render('usuarios/cadastro')
})

router.post('/cadastro', (req, res) => {
    let erros = []

    validaCadastroUsuario(req, erros)

    if(erros.length > 0){
        res.render('usuarios/cadastro', {erros:erros})
    }else{

        Usuario.findOne({email:req.body.email}).then((usuario)  => {
            if(usuario){
                req.flash('error_msg', 'Ja existe uma conta com esse email, no nosso sistema')
                res.redirect('/usuarios/cadastro')
            }else{
                const novoUsuario = new Usuario({
                    nome:req.body.nome,
                    email:req.body.email,
                    senha:req.body.senha
                })

                bcrypt.genSalt(10, (erros, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt , (erros, hash) => {
                            if(erros){
                                req.flash('error_msg', 'Houve um erro_msg durante o salvamento do usuario')
                                res.redirect('/')
                            }

                            novoUsuario.senha = hash

                            novoUsuario.save().then(() => {
                                req.flash('success_msg', 'Usuario criado com sucesso')
                                res.redirect('/')
                            }).catch((err) => {
                                req.flash('error_msg', 'Houve um erro ao cria o usuario, tente novamente')
                                res.redirect('/')
                            })
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro insterno')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect:'/usuarios/login',
        failureFlash:true
    })(req, res, next)

})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        req.flash('success_msg', 'Deslogado com sucesso')
        res.redirect('/')
    })
    
})

module.exports = router