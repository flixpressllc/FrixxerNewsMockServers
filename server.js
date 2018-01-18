require('import-export')
const argv = require('yargs').argv
const path = require('path')
const chokidar = require('chokidar')
const jsonServer = require('json-server')
const jsonServerMiddlewares = jsonServer.defaults()
const runMiddleware = require('run-middleware')
const http = require('http')
const support = require('./server-support')
const { uploadFile, serveUploadedFiles } = require('./upload-support')
const port = argv.port
const staticAssetsUrlPrefix = '/files'
const pathToDbFile = argv.database || './db.js'

function startNewServer () {
  const server = jsonServer.create()
  runMiddleware(server)
  delete require.cache[require.resolve(pathToDbFile)] // force node to reload file
  const router = jsonServer.router(require(pathToDbFile))

  router.render = (req, res) => {
    res.jsonp({
      // Wrap everything in a data property
      data: res.locals.data
    })
  }

  server.use(jsonServerMiddlewares)

  server.post('/token', (req, res) => {
    res.jsonp({access_token: 'somekindatoken'})
  })

  // To handle POST, PUT and PATCH you need to use a body-parser
  // You can use the one used by JSON Server
  server.use(jsonServer.bodyParser[0])
  server.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
      req.body = req.body.data
    }
    // Continue to JSON Server router
    next()
  })

  server.get('/shotlayouts/new', support.getNewShotLayout)
  server.get('/shotlayouttags/new', support.getNewShotLayoutTag)
  server.get('/newscasts/new', support.getNewNewscast)
  server.get('/segmenttypes/new', support.getNewSegmentType)
  server.get('/packagetemplates/new', support.getNewPackageTemplate)
  server.get('/packages/complete', support.getComplete(router.db))
  server.get('/packages/pending', support.getPending(router.db))

  server.post('/shots/previewData', support.previewShotData)
  server.post('/newscasts/:id/preview', support.previewNewscast)
  server.post('/segments/:id/preview', support.previewSegment)
  server.post('/packages/:id/order', support.orderPackage(router.db))

  server.get('/shotlayouts/:id/newShot', support.getNewShot)
  server.get('/segmenttypes/:id/newSegment', support.getNewSegment)
  server.get('/packagetemplates/:id/newPackage', support.getNewPackage)
  server.get('/shots/fulfillment', support.getUnfulfilledShots(router.db))

  server.post('/upload', uploadFile(`http://localhost:${port}${staticAssetsUrlPrefix}`))
  server.use(staticAssetsUrlPrefix, serveUploadedFiles)

  server.use(router)

  return server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`)
  })
}

(function init () {
  let server = startNewServer()

  const reset = () => {
    return new Promise(resolve => {
      server.close(() => {
        server = startNewServer()
        setTimeout(() => resolve(), 0)
      })
    })
  }

  function resetSiblingServer (req, res) {
    reset().then(() => {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.write('Server reset.')
      res.end()
    })
  }

  const resetServer = http.createServer(resetSiblingServer)
  resetServer.listen(3001, '127.0.0.1')

  const watcher = chokidar.watch(path.join(__dirname, pathToDbFile))

  watcher.on('change', () => reset())
})()