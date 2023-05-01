import swaggerUi from 'swagger-ui-express'
import swaggereJsdoc from 'swagger-jsdoc'

const options = {
    swaggerDefinition: {
        info: {
            title: 'SmartWork API',
            version: '1.5.9',
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
