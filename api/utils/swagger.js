import swaggerUi from 'swagger-ui-express'
import swaggereJsdoc from 'swagger-jsdoc'
import { projectVersion } from '../config/working.js'

const options = {
    swaggerDefinition: {
        info: {
            title: 'SmartWork API',
            version: projectVersion,
        },
        basePath: '/api'
    },
    apis: ['./routes/*.js']
}
const specs = swaggereJsdoc(options)

export {
    swaggerUi,
    specs
}
