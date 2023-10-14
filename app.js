//carregando modulos    
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const blog = require('./routes/blog')
    const usuarios = require('./routes/usuarios')
    const patch = require('path')
    const mongoose = require('mongoose');
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagens')
    const Postagem = mongoose.model('postagens')
    const passport = require('passport')
    require('./config/auth')(passport)

//inicializando express
const app = express()


//Consfiguraçoes 
    
    //Sessao
        app.use(session({
            secret:'aprendendo node',
            resave:true,
            saveUninitialized:true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.connect("mongodb://0.0.0.0:27017/blogNode", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }).then(() => { 
                console.log("Banco conectado com sucesso!!!");
            })
            .catch((err) => {
                
                console.log("Houve um erro ao se conectar ao banco: " + err);
        });
    //Public
        app.use(express.static(patch.join(__dirname, 'public')))


//Rotas


app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({ _id: -1 }).lean().then((postagens) => {
        res.render('blog/index', { postagens: postagens })
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as postagens")
        res.redirect("/blog/index")
    })
})

app.get('/post/:id', (req, res) => {
    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {
        if(postagem){
            res.render('blog/publication/publication', {postagem:postagem})
        }else{
            req.flash('error_msg', 'Esta postagem nao existe')
            res.redirect('blog/index')
        }
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('blog/index')
    })
})


app.use('/blog', blog)
app.use('/usuarios', usuarios)


// servidor    
const PORT = 3000

app.listen(PORT, () => {
    console.log('servidor inicializando')
})