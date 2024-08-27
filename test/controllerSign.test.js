const { signController } = require('../src/controllers/v1/')
const Response = require('./ResponseObject')

describe('testing sign controller', () => {

    it('sing with user and password CORRECT', async () => {
        const res_controller = new Response()
        await signController({
            originalUrl: "/api/v1/auth/sign",
            method: "POST",
            body: {
                username: "bryan23",
                password: "123456789"
            }
        }, res_controller)
        expect(res_controller._status).toBe(200)
        expect(Object.keys(res_controller._headsr)).toEqual(['auth'])
        expect(res_controller._json).toEqual(
            {
                state: 'ok',
                url_avatar: res_controller._json.url_avatar,
                id_user: 510,
                password: true,
                username: "bryan23",
                token: res_controller._json.token
            })
    })

    it('sing with username INCORRECT', async () => {
        const res_controller = new Response()
        await signController({
            originalUrl: "/api/v1/auth/sign",
            method: "POST",
            body: {
                username: "anna23",
                password: "0230022abc"
            }
        }, res_controller)
        expect(res_controller._status).toBe(404)
        expect(res_controller._json).toEqual(
            {
                state: "failure",
                request: {
                    url: "/api/v1/auth/sign",
                    method: "POST"
                },
                error: {
                    code: 17,
                    severity: "exception",
                    type: "user_not_found",
                    message: "El usuario [anna23] no existe"
                }
            })


    })


    it('sing with password INCORRECT', async () => {
        const res_controller = new Response()
        await signController({
            originalUrl: "/api/v1/auth/sign",
            method: "POST",
            body: {
                username: "bryan23",
                password: "abdc12324kasj"
            }
        }, res_controller)
        expect(res_controller._status).toBe(401)
        expect(res_controller._json).toEqual({
            state: "failure",
            request: {
                url: "/api/v1/auth/sign",
                method: "POST"
            },
            error: {
                code: 14,
                severity: "exception",
                type: "password_incorrect",
                message: "Contraseña incorrecta"
            }
        })


    })


})

