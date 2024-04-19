require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT ,
    }, 
    jwt:{
        secretAdmin: process.env.JWT_SECRET_ADMIN , 
        secretCliente: process.env.JWT_SECRET_CLIENTE 
    },
    mysql:{
        host: process.env.MYSQL_HOST, 
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD, 
        database: process.env.MYSQL_DB 
    }
}
