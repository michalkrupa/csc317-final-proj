require('dotenv').config()

const DEBUG = process.env.DEBUG == '1';``

module.exports = {
    debug: DEBUG,
    session: {
        secret: process.env.SESSION_SECRET,
    }
}