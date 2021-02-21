var User = require("../models/User")
var PasswordToken = require("../models/PasswordToken")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")

var secret = "Gaabriell"

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

    // Edit user
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

    // Delete user
    async remove(req, res) {
        var id = req.params.id

        var result = await User.delete(id)

        if(result.status) {
            res.sendStatus(200)
        } else {
            res.status(406)
            res.send(result.error)
        }
    }

    // Recover password user
    async recoverPassword(req, res) {
        var email = req.body.email

        var result = await PasswordToken.create(email)

        if(result.status) {
            // Aqui já dá pra mandar um e-mail para recuperação de senha usando o token
            // console.log(result.token)
            res.status(200)
            res.send("" + result.token)
        } else {
            res.status(406)
            res.send(result.error)
        }
    }

    async changePassword(req, res) {
        var token = req.body.token
        var password = req.body.password

        var isTokenValid = await PasswordToken.validate(token)

        if(isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada")
        } else {
            res.status(406)
            res.send("Token inválido")
        }
    }

    async login(req, res) {
        var {email, password} = req.body

        var user = await User.findByEmail(email)

        if(user != undefined) {
            var result = await bcrypt.compare(password, user.password)
            
            if(result) {
                var token = jwt.sign({ email: user.email, role: user.role }, secret);
                
                res.status(200)
                res.json({token: token})
            } else {
                res.status(406)
                res.send("Senha incorreta")
            }
        } else {
            res.json({status: false})
        }
    }
}

module.exports = new UserController()