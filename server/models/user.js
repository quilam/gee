import config from './../../config/config'

const Sequelize = require('sequelize')
const crypto = require('crypto')


//const sequelize = require('./../db.js')

//require('sequelize-isunique-validator')(Sequelize)

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,

    operatorsAliases: 0,
  
      pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  })
const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    
        
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        
      
        
    },
    salt: {
        type: Sequelize.STRING,
      
    }
   
})


const setSaltAndPassword = user => {
    if (user.changed('password')) {
        user.salt = User.generateSalt()
        user.password = User.encryptPassword(user.getDataValue('password'), user.getDataValue('salt'))
    }
}

User.prototype.authenticate = function(enteredPassword) {
    return User.encryptPassword(enteredPassword, this.getDataValue('salt')) === this.getDataValue('password')
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)

User.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64')
}
User.encryptPassword = function(plainText, salt) {
    return crypto
        .createHash('RSA-SHA256')
        .update(plainText)
        .update(salt)
        .digest('hex')
}

User.sync()

export default User