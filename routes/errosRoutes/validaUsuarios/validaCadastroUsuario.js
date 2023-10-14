function validaCadastroUsuario(req, erros){

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null){
        erros.push({texto:'Nome invalido'})
    }

    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null){
        erros.push({texto:'Email invalido'})
    }

    if(req.body.senha.length <= 5){
        erros.push({texto: 'Senha tem que conter mais de 5 caracter'})
    }

    if(req.body.senha !== req.body.senha2){
        erros.push({texto: 'As senhas sao diferentes tente novamente'})
    }

    return erros
}

module.exports = validaCadastroUsuario