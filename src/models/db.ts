import path from 'path'
import { Sequelize } from 'sequelize'
const config = require(path.resolve('sequelize.config.js'))


export const sequelize = new Sequelize(process.env.DB_URL!, config)

export default sequelize
