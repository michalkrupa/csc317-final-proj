require('dotenv').config()

const DEBUG = process.env.DEBUG == '1';``

module.exports = {
    debug: DEBUG || false,
    session: {
        secret: process.env.SESSION_SECRET || 'secretchangeme',
        secure: Boolean(process.env.SESSION_SECURE) || false,
    }
}