const Sequelize = require('sequelize');

//connection to database 'jogjaku'
const sequelize = new Sequelize('jogjaku','root','',{
    dialect: "mysql",
    host: "localhost"
})

module.exports = sequelize;