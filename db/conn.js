const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('Conectado ao MySQL!')
} catch (error) {
    console.log(`não foi possível conectar: ${error}`)

}

module.exports = sequelize