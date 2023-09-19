const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Destination = sequelize.define("destinations",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.TEXT,
        allowNull: true,
    },
    location:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    regency:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    imageUrl:{
        type: Sequelize.TEXT,
        allowNull: true,
    }
},{
    timestamps: false
})

module.exports = Destination;