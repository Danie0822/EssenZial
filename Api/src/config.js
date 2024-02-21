require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000,
    }, 
    jwt:{
        secretAdmin: process.env.JWT_SECRET_ADMIN || 'H4F9cWyS4VmP89pDHmY9CwR2gCm7aZKj', 
        secretCliente: process.env.JWT_SECRET_CLIENTE || '3sKtRm2wF7gA4xP8jGzDcVfT5nYq3vXs' 
    },
    mysql:{
        host: process.env.MYSQL_HOST || 'localhost', 
        user: process.env.MYSQL_USER || 'root', 
        password: process.env.MYSQL_PASSWORD || '', 
        database: process.env.MYSQL_DB || 'EssenZial'
    }
}
