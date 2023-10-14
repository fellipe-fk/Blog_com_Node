function validaErroCadastro(req, erros){

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null){
        erros.push({texto:'nome invalido'})
    }

    if(!req.body.slug || typeof req.body.slug === undefined || req.body.slug === null){
        erros.push({texto:'slug invalido'})
    }

    if(req.body.nome.length < 1){
        erros.push({texto:'nome muito pequeno'})
    }

    if(req.body.slug.length < 1){
        erros.push({texto:'slug muito pequeno'})
    }

    return erros
}

module.exports = validaErroCadastro