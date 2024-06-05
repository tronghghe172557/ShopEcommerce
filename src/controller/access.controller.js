const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {

    login = async(req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res)
    }

    signUp = async(req, res, next) => {
        
        // return res.status(201).json(await AccessService.signUp(req.body))
        new CREATED({
            message: 'Register OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }
}

module.exports = new AccessController();