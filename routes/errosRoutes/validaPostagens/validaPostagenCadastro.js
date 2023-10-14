function validaPostagemCadastro(req, erros){

    if(req.body.categoria == '0'){
        erros.push({texto: 'Categoria invalida, registre uma categoria'})
    }

    if(!req.body.titulo || typeof req.body.titulo === undefined || req.body.titulo === null){
        erros.push({texto:'Titulo invalido'})
    }

    if(!req.body.descricao || typeof req.body.descricao === undefined || req.body.descricao === null){
        erros.push({texto:'Descriçao invalido'})
    }

    if(!req.body.conteudo || typeof req.body.conteudo === undefined || req.body.conteudo === null){
        erros.push({texto:'Conteudo invalido'})
    }

    return erros
}

module.exports = validaPostagemCadastro