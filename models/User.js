var knex = require("../database/connection")
var bcrypt = require("bcrypt")

class User {
    async new(name, email, password) {
        try {
            var hash = await bcrypt.hash(name, 10)

            await knex("users").insert({name: name, email: email, password: hash, role: 0})
        } catch(error) {
            console.log(error)
        }
    }

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
}

module.exports = new User()