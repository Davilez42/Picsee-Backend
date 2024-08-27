const { userRepository } = require('../src/database/dependencies')
const pool = require('../src/database/connectionPool')
const UserNotFound = require('../src/exceptions/UserNotFound')
const DataAlreadyExist = require('../src/exceptions/DataAlreadyExist')



describe('user repository test', () => {
    describe('find a user test', () => {
        afterEach(async () => {
            const client = await pool.connect()
            await client.query(`DELETE from users where username = 'geekins'`)
        })
        it('get a user with exist username ', async () => {
            const userFound = await userRepository.find('geekins')
            expect(userFound.url).toEqual('https://ik.imagekit.io/picmont/icons/default_avatar.png?updatedAt=1687206611943')
            expect(userFound.password).toEqual('123456abcd')
            expect(userFound.username).toEqual('geekins')
            expect(Number.isInteger(userFound.id_user)).toBeTruthy()
        })

        it('get a user with not exist username ', async () => {
            expect(userRepository.find('geekins')).rejects.toEqual(new UserNotFound('geekins'))
        })
    })


    describe('create a user test', () => {
        it('create a user with not exist username and email', async () => {
            const insertId = await userRepository.create({
                username: 'geekins',
                password: '123456abcd',
                first_names: 'geek',
                last_names: "kins",
                email: "ggeek@gmail.com"
            })
            expect(Number.isInteger(insertId)).toBeTruthy()

        })
        it('create a user with  exist username', async () => {
            expect(userRepository.create({
                username: 'geekins',
                password: '123456abcd',
                first_names: 'geek',
                last_names: "kins",
                email: "new2Geek@gmail.com"
            })).rejects.toEqual(new DataAlreadyExist('username'))

        })

        it('create a user with  exist email', async () => {
            expect(userRepository.create({
                username: 'GeekinsNew',
                password: '123456abcd',
                first_names: 'geek new',
                last_names: "kins new",
                email: "ggeek@gmail.com"
            })).rejects.toEqual(new DataAlreadyExist('email'))

        })
    })

})