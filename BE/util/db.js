const Sequelize = require('sequelize');

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_INSTANCE = process.env.DB_INSTANCE;

console.log(process.env.INSTANCE_UNIX_SOCKET, DB_NAME);

//connection to database 'jogjaku'
// const sequelize = new Sequelize('jogjaku', 'jogjaku85', '', {
//     dialect: "mysql",
//     host: "localhost"
// })

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: `/cloudsql/${process.env.DB_INSTANCE}`,
    dialect: 'mysql',
    dialectOptions: {
      socketPath: `${process.env.INSTANCE_UNIX_SOCKET}`,
    },
  });

module.exports = sequelize;