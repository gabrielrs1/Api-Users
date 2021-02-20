var User = require("../models/User")

class UserController {
    // All users
    async index(req, res) {
        var users = await User.FindAll()
        res.json(users)
    }

    // Find user
    async findUser(req, res) {
        var id = req.params.id
        var user = await User.findById(id)

        if(user == undefined) {
            res.status(404)
            res.json({})
        } else {
            res.status(200)
            res.json(user)
        }
    }

    // Create users
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

    async edit(req, res) {
        var { id, name, email, role} = req.body

        var result = await User.update(id, name, email, role)
        if(result != undefined) {
            if(result.status) {
                res.sendStatus(200)
            } else {
                res.sendStatus(406)
            }
        } else {
            res.json({err: "erro na edicao"})
        }
    }
}

module.exports = new UserController()