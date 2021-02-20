var knex = require("../database/connection")
var bcrypt = require("bcrypt")

class User {
    // Buscando todos os usuários
    async FindAll() {
        try {
            var result = await knex.select(["id", "name", "email", "role"]).table("users")
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }

    // Buscando usuário por id
    async findById(id) {
        try {
            var result = await knex.where({ id: id }).select(["id", "name", "email", "role"]).table("users")
            if(!result[0]) {
                return undefined
            } else {
                return result[0]
            }
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    // Criação do novo usuário
    async new(name, email, password) {
        try {
            var hash = await bcrypt.hash(password, 10)

            await knex("users").insert({name: name, email: email, password: hash, role: 0})
        } catch(error) {
            console.log(error)
        }
    }

    // Verificar se email está cadastrado
    async findEmail(email) {
        try {
            var result = await knex.select("*").from("users").where({ email: email })  
            
            if(!result[0]) {
                return false
            } else {
                return true
            }
        } catch (error) {
            console.log(error)
        }
    }

    async update(id, name, email, role) {
        var user = await this.findById(id)
        
        if(user != undefined) {
            var editUser = {}

            if(email != undefined) {
                if(email != user.email) {
                    var result = await this.findEmail(email)

                    if(result == false) {
                        editUser.email = email
                    } else {
                        return {status: false, err: "O e-mail já está cadastrado"}
                    }
                }
            }

            if(name != undefined) {
                editUser.name = name
            }
            if(name != undefined) {
                editUser.role = role
            }

            try {
                await knex.update(editUser).where({id: id}).table("users")
                return {status: true}
            } catch (error) {
                return {status: false, error: error}   
            }
        } else {
            return {status: false, err: "O usuário não existe"}
        }
    }
}

module.exports = new User()