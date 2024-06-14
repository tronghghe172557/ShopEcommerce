const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {

    handlerRefreshToken = async(req, res, next) => {
        const refreshToken = req.headers['x-rtoken-id']

        // V2 fixed, no need accessToke
        if(refreshToken) {

            new SuccessResponse({
                message: 'handlerRefreshToken success',
                metadata: await AccessService.handlerRefreshTokenV2({
                    refreshToken: req.refreshToken,
                    user: req.user,
                    keyStore: req.keyStore
                }),
            }).send(res)
            
        } else {

            new SuccessResponse({
                message: 'handlerRefreshToken success',
                metadata: await AccessService.handlerRefreshToken( req.body.refreshToken ),
            }).send(res)

        }
        
    }

    logout = async(req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.logout( req.keyStore ),
        }).send(res)
    }

    login = async(req, res, next) => {
        new SuccessResponse({
            message: 'Login success',
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