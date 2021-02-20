var User = require("../models/User")

class UserController {
    async index(req, res) {}

    async create(req, res) {
        var { name, email, password } = req.body
        
        if(name == undefined) {
            res.status(403)
            res.json({name: "undefined"})
            // como está sendo utilizado constrollers, o uso de return na validação para poder finalizar o código corretamente
            return
        }
        if(email == undefined) {
            res.status(403)
            res.json({email: "undefined"})
            return
        }
        if(password == undefined) {
            res.status(403)
            res.json({password: "undefined"})
            return
        }

        var emailExists = await User.findEmail(email)

        if(emailExists) {
            res.status(406)
            res.json({err: "E-mail já cadastrado"})
            return
        }

        await User.new(name, email, password)

        res.sendStatus(200)
    }
}

module.exports = new UserController()