import { readFileSync } from 'fs'
import { Sequelize } from 'sequelize'
const config = JSON.parse(readFileSync('sequelize.config.js').toString())


export const sequelize = new Sequelize(process.env.DB_URL!, config)

export default sequelize
