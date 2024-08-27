
const { createUserController } = require('../src/controllers/v1/')
const pool = require('../src/database/connectionPool')
const ResponseObject = require('./ResponseObject')

describe('create user test', () => {
    afterAll(async () => {
        const client = await pool.connect()
        await client.query(`DELETE from users where username = 'Tom453'`)
    })

    it('create a new user', async () => {
        const respObject = new ResponseObject()
        await createUserController({
            body: {
                "username": "Tom453",
                "password": "donkipet213",
                "first_names": "Tom jhonson",
                "last_names": "clay",
                "email": "Tom453@gmail.com"
            }
        }, respObject)
        expect(respObject._status).toBe(200)
        expect(respObject._json.state).toEqual('ok')
        expect(Number.isInteger(respObject._json.id_user)).toBeTruthy()
        expect(respObject._json.username).toEqual('Tom453')
        expect(respObject._json.password).toBeTruthy()
        expect(respObject._json.token).toBeDefined();
        expect(respObject._json.url_avatar).toBeDefined();
    })

    it('create a new user with exist username', async () => {
        const respObject = new ResponseObject()
        await createUserController({
            body: {
                "username": "Tom453",
                "password": "zxcvbnmhgfsy",
                "first_names": "Tom clay",
                "last_names": "cardona",
                "email": "hleeo2@gmail.com"
            }
        }, respObject)
        expect(respObject._status).toBe(202)
        expect(respObject._json.state).toEqual('failure')
        expect(respObject._json.error).toEqual({
            "code": 10,
            "severity": "exception",
            "type": "data_already_exist",
            "message": "username"
        })
    })

    it('create a new user with exist email', async () => {
        const respObject = new ResponseObject()
        await createUserController({
            body: {
                "username": "gary23",
                "password": "sdavvvvvzx",
                "first_names": "gary jhonsons",
                "last_names": "suarez",
                "email": "Tom453@gmail.com"
            }
        }, respObject)
        expect(respObject._status).toBe(202)
        expect(respObject._json.state).toEqual('failure')
        expect(respObject._json.error).toEqual({
            "code": 10,
            "severity": "exception",
            "type": "data_already_exist",
            "message": "email"
        })
    })
})