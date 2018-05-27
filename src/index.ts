import 'reflect-metadata'
import {createKoaServer} from 'routing-controllers'
// import ProductController from './products/controller'
import setupDb from './db'
import gameController from './games/controller'

const app = createKoaServer({
  controllers: [
    gameController
  ]
})

setupDb()
  .then(_ =>
    app.listen(4000, () => console.log('Listening on port 4000'))
  )
  .catch(err => console.error(err))