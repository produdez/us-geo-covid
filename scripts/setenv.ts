const { writeFile } = require('fs')
const { argv } = require('yargs')
// read environment variables from .env file
require('dotenv').config()

// read the command line arguments passed with yargs
const environment = argv.environment
const isProduction = environment === 'prod'

const BACKEND_URL = isProduction ? process.env['BACKEND_URL'] : 'http://127.0.0.1:8000/api-covid'

const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`
// we have access to our environment variables
// in the process.env object thanks to dotenv

const environmentFileContent = `
    export const environment = {
    production: ${isProduction},
    BACKEND_URL: "${BACKEND_URL}",
    }
`
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: any) {
   if (err) {
      console.log(err)
   }
   console.log(`Wrote variables to ${targetPath}`)
})
