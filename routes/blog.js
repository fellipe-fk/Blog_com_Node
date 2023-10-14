//exportando modulos
    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    require('../models/Categorias')
    const Categoria = mongoose.model('categorias')
    require('../models/Postagens')
    const Postagem = mongoose.model('postagens')
    const {Admin} = require('../helpers/Admin')
//

//importando funçoes de validaçao

    const validaErroCadastro = require('./errosRoutes/validaCategoria/validaCategoriasCadastro')
    const validaPostagemCadastro = require('./errosRoutes/validaPostagens/validaPostagenCadastro')
//

//Rotas de Categorias

router.get('/categorias', Admin, (req, res) => {
    Categoria.find().sort({_id:-1}).lean().then((categorias) => {
        res.render('blog/Categorias/categorias', {categorias:categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao lista as categorias')
        res.redirect('/blog')
    })
})

router.get('/categorias/add', Admin, (req, res) => {
    res.render('blog/Categorias/addcategorias')
})

router.post('/categorias/cadastro', Admin, (req, res) => {

    let erros = []

    validaErroCadastro(req, erros)

    if(erros.length > 0){
        res.render('blog/Categorias/addcategorias', {erros:erros})
    }else{

        const novaCategoria = {
            nome: req.body.nome,
            slug:req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso')
            res.redirect('/blog/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cria a categoria')
            res.redirect('/blog/categorias')
        })
    }

})

router.get('/categorias/edit/:id', Admin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('blog/Categorias/editarcategorias', {categorias: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao exibir a categoria')
        res.redirect('/blog/categorias')
    })
})  

router.post('/categorias/edit', Admin, (req, res) => {
    const {id, nome, slug} = req.body

    let erros = []

    validaErroCadastro(req, erros)

    if(erros.length){
        res.render('blog/Categorias/editarcategorias', {erros: erros})
    }else{
        Categoria.findOneAndUpdate(
            {_id:id},
            {nome:nome, slug:slug},
            {new:true}
        ).then((categoria) => {
            if(!categoria){
                req.flash('error_msg', 'Categoria não encontrada');
                return res.redirect('/blog/categorias');
            }
            req.flash('success_msg', 'Categoria editada com sucesso');
            res.redirect('/blog/categorias');
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Houve um erro ao salva a categoria');
            res.redirect('/blog/categorias');
        })
    }
})

router.get('/categorias/deletar/:id', Admin, (req,res) => {
    Categoria.findOneAndDelete({_id: req.params.id}).then(()=> {
        req.flash('success_msg','Categoria deletada com sucesso')
        res.redirect('/blog/categorias')
    }).catch((err) => {
        req.flash('error_msg','Houve um erro ao deletar a categoria')
        res.redirect('/blog/categorias')
    })
})

//Fim das rosta de categorias

//Rotas de postagens

router.get("/postagens", Admin, (req, res) => {
    Postagem.find().populate('categoria').sort({ _id: -1 }).lean().then((postagens) => {
        res.render("blog/Postagens/postagens", { postagens: postagens })
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as postagens")
        res.redirect("/blog/postagens")
    })
})

router.get('/postagens/add', Admin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('blog/Postagens/addpostagens', {categorias:categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao lista as categorias')
        res.redirect('/blog/postagens')
    })
})

router.post('/postagens/cadastro', Admin, (req, res) => {

    let erros = []

    validaPostagemCadastro(req, erros)

    if(erros.length > 0){
        Categoria.find().lean().then((categorias) => {
            res.render('blog/Postagens/addpostagens', {erros:erros, categorias:categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao lista as categorias')
            res.redirect('/blog/postagens')
        })
    }else{
        const novaPostagem = {
            titulo:req.body.titulo,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria
        }
    
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/blog/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao cria a postagema')
            res.redirect('/blog/postagens')
        })
    }
})

router.get('/postagens/edit/:id', Admin, (req, res) => {

    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {
       Categoria.find().lean().then((categorias) => {
        res.render('blog/Postagens/editarpostagem', {categorias:categorias , postagem:postagem})
       })
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Houve um erro ao exibir a postagem')
        res.redirect('/blog/editarpostagem')
    }).catch((err) => {
        req.flash('erro_msg', 'Houve um erro ao carrega o formulariode ediçao')
        res.redirect('/blog/postagens')
    })
})

router.post('/postagens/edit', Admin, (req, res) => {

    const {id, titulo, descricao, conteudo, categoria} = req.body

    let erros = []

    validaPostagemCadastro(req, erros)

    if(erros.length > 0){
        Categoria.find().lean().then((categorias) => {
            res.render('blog/Postagens/addpostagens', {erros:erros, categorias:categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao lista as categorias')
            res.redirect('/blog/postagens')
        })
    }else{
        Postagem.findOneAndUpdate(
            {_id:id},
            {titulo:titulo, descricao:descricao, conteudo:conteudo, categoria:categoria},
            {new: true}
        ).then((postagem) => {
            if(!postagem){
                req.flash('error_msg', 'Postagem não encontrada');
                return res.redirect('/blog/postagens');
            }
            req.flash('success_msg', 'Postagem editada com sucesso');
            res.redirect('/blog/postagens');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salva a postagem');
            res.redirect('/blog/postagens');
        })
    }
})


router.get('/postagens/deletar/:id', Admin, (req, res) => {

    Postagem.findOneAndDelete({_id:req.params.id}).then(() => {
        req.flash('success_msg', 'Postagem Deletada com sucesso')
        res.redirect('/blog/postagens')
    }).catch((err) => {
        req.flash('error_msg','Houve um erro ao deletar a categoria')
        res.redirect('/blog/postagens')
    })
})

// Fim das rotas de postage

module.exports = router