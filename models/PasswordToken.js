var knex = require("../database/connection")
var User = require("./User")

// Recuperar senha
class PasswordToken {
    async create(email) {
        var user = await User.findByEmail(email)

        if(user != undefined) {
            try {
                var token = Date.now()

                await knex("passwordtokens").insert({
                    user_id: user.id,
                    used: 0,
                    token: token // usando data como token, pode trocar por UUID ou GUID
                })  

                return {status: true, token: token}
            } catch (error) {
                console.log(error)
                return {status: false, error: error}
            }
        } else {
            return {status: false, error: "O e-mail não existe no banco de dados"}
        }
    }

    async validate(token) {
        try {
            var result = await knex.select().where({token: token}).table("passwordtokens") 
            
            if(result[0]) {
                var tk = result[0]

                if(tk.used) {
                    return {status: false}
                } else {
                    return {status: true, token: tk}
                }
            } else {
                return {status: false}
            }
        } catch (error) {
            console.log(error)
            return {status: false}
        }
    }

    async setUsed(token) {
        await knex("passwordtokens").update({used: 1}).where({token: token})
    }
}

module.exports = new PasswordToken()