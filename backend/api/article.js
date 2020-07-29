const queries = require('./queries')

module.exports = app =>{
    const { existsOrError} = app.api.validation;

    const save = (request, response) => {
        const articles = {...request.body}
       
        if(request.params.id)
        articles.id = request.params.id

        try{
            existsOrError(articles.name, 'Nome não informado')
            existsOrError(articles.description, 'Descrição não informado')
            existsOrError(articles.categoryId, 'Categoria não informado')
            existsOrError(articles.userId, 'Autor não informado')
            existsOrError(articles.content, 'Conteudo não informado')
        }
        catch(msg){
            response.status(400).send(msg)
        }

        if(articles.id){
            app.db('articles')
                .update(articles)
                .where({id: articles.id})
                .then(_ => response.status(204).send())
                .catch(err => response.status(500).send(err))
        }
        else{
            app.db('articles')
                .insert(articles)
                .then(_ => response.status(204).send())
                .catch(err => response.status(500).send(err))
        }
    }
    
    const remove = async(request, response) => {
        const idArticle = request.params.id;
        try{
            const rowsDeleted = await app.db('articles')
            .where({id: idArticle}).del()
             existsOrError(rowsDeleted, 'Artigo não foi encontrado')
             response.status(204).send()
        }
        catch(msg){
            response.status(500).send(msg)
        }
    }

    //Paginação

    const limit = 10

    const get = async (request, response) => {
        const page = request.query.page || 1

        const result = await app.db('articles').count('*').first()
        const count = parseInt(result.count)

        app.db('articles')
            .select('*')
            .limit(limit)
            .offset(page * limit - limit)
            .then(articles => response.json({data: articles, count, limit}))
            .catch(err => response.status(500).send(err))
    }

    const getById = (request, response) => {

        app.db('articles')
            .where({id: request.params.id})
            .first()
            .then(articles => {articles.content = articles.content.toString()
                response.json(articles)})   
            .catch(err => response.status(500).send(err))
    }

    const getByCategory = async (request, response) => {
        const categoryId = request.params.id;
        const page = request.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {author: 'u.name'})
            .limit(limit)
            .offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => response.json(articles))
            .catch(err => response.status(500).send(err))
    }

    return {save, remove, get, getById, getByCategory}

}