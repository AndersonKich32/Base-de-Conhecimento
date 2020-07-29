const bcrypt = require('bcrypt-nodejs');


module.exports = app =>{
    const { existsOrError, notExistsOrError, equalsOrError} = app.api.validation;

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt)
    }

    const save = async(request, response) =>{
        const user = {...request.body}
        if(request.params.id) user.id = request.params.id;

        

   
        try{
            existsOrError(user.name, 'Nome não informado');
            existsOrError(user.email, 'E-mail não informado');
            existsOrError(user.password, 'Senha não informada');          

            const userFronDB = await app.db('users')
            .where({email: user.email}).first();

            if(!user.id){
                notExistsOrError(userFronDB, 'Usuario já cadastrado')
                existsOrError(user.comfirmPassword, 'Comfirmação de senha inválida');
                equalsOrError(user.password, user.comfirmPassword, 'Senhas não conferem');
            }
            

        }catch(msg){
            return response.status(400).send(msg);
        }

        user.password = encryptPassword(user.password)
        delete user.comfirmPassword;

        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .whereNull('deletedAt')
                .then(_ => response.status(204).send())
                .catch(err => response.status(500).send(err))
        }else{
            app.db('users')
                .insert(user)
                .then(_ => response.status(204).send())
                .catch(err => response.status(500).send(err))
        }
        
    }

    const get = (request, response) =>{
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => response.json(users))
            .catch(err => response.status(500).send(err))
    }

    const getById = (request, response) =>{
        const id =  request.params.id;
    
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({id: id})
            .whereNull('deletedAt')
            .first()
            .then(user => response.json(user))
            .catch(err => response.status(500).send(err))
    }

    const remove = async (request, response) => {
        try{
            const articles = await app.db('articles')
                .where({userId: request.params.id})
            notExistsOrError(articles, 'Usuario possui artigos.')

            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()})
                .where({id: request.params.id})
            existsOrError(rowsUpdated, 'Usuario não foi encontrado.')

            response.status(204).send()
        }
        catch(msg){
            response.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}