module.exports = app => {
    const { existsOrError, notExistsOrError} = app.api.validation;

    const save = (request, response) =>{

        const category = {...request.body}

        if(request.params.id) category.id = request.params.id;

        try{
            existsOrError(category.name, 'Nome não informado')
        }
        catch(msg){
            return response.status(400).send(msg);
        }

        if(category.id){
            app.db('categories')
                .update(category)
                .where({id: category.id})
                .then(_ => response.status(204).send())
                .catch(err => response.status(500).send(err))
        }
        else{
            app.db('categories')
                .insert(category)
                .then(_ => response.status(204).send())
                .catch(err => response.status(500).send(err))
        }
    }

    const remove = async (request, response) => {
        const idCategory = request.params.id;
        try{
            existsOrError(idCategory, 'Codigo de categoria não informado')

            const subcategory = await app.db('categories')
                .where({parentId: idCategory})
            notExistsOrError(subcategory, 'Categoria possui subcategorias')

            const articles = await app.db('articles')
                .where({categoryId: idCategory})
            notExistsOrError(articles, 'Categoria possui artigos')

            const rowsDeleted = await app.db('categories')
                .where({id: idCategory}).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada')
            
            response.status(204).send()
        }catch(msg){
            response.status(400).send(msg)
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
           
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category =>{
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent){
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return {...category, path}
        })

        categoriesWithPath.sort((a, b) =>{
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = (request, response) =>{
        app.db('categories')
            .then(categories => response.json(withPath(categories)))
            .catch(err => response.status(500).send(err))
    }

    const getById = (request, response) =>{
        app.db('categories')
            .where({id: request.params.id})
            .first()
            .then(category => response.json(category))
            .catch(err => response.status(500).send(err))
    }

    const toTree = (categories, tree) =>{
        if(!tree){ tree = categories.filter(c => !c.parentId)} 
       
        tree = tree.map(parentNode =>{
            const isChild = node => node.parentId == parentNode.id 
            parentNode.children  = toTree(categories, categories.filter(isChild))
            return parentNode
        }) 
        console.log(tree)
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
        .then(categories => res.json(toTree(withPath(categories))))
        .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}