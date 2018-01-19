const argv = require('yargs').argv
const express = require('express')
const bodyParser = require('body-parser')
const { getPreviewUrl } = require('./server-support')
const http = require('http')
const request = require('request')
const port = argv.port
const { getMyIpAddress } = require('./ipAddressHelpers')
const givenRemoteServerEndpoint = argv.reportEndpoint

function reportMyIp () {
  const options = {
    url: givenRemoteServerEndpoint,
    json: true,
    body: {data: getMyIpAddress() + ':' + port},
    method: 'POST'
  }
  request(options, (err, response) => {
    if (err) console.log(err)
  })
}

function startNewServer () {
  reportMyIp()
  const server = express()
  const newInMemory = () => ({ shotState: 'NoShot' })
  let inMemory = newInMemory()
  delete require.cache[require.resolve('./db.js')] // force node to reload file

  server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  server.use(bodyParser.json())

  server.get('/shot', (req, res) => {
    const { shot, shotState } = inMemory
    res.jsonp({data: {shot: shot || null, shotState}})
  })

  server.post('/shot/queue', (req, res) => {
    const shot = req.body['data']
    let status = 400
    let resBody = Promise.resolve({errors: [{message: 'no shot received'}]})
    if (shot) {
      inMemory.shot = req.body['data']
      inMemory.shotState = 'Queued'
      status = 200
      resBody = getPreviewUrl().then(url => ({data: {fileUrl: url}}))
    }
    res.status(status)
    resBody.then(body => res.jsonp(body))
  })

  server.post('/shot/record', (req, res) => {
    let status = 428 // Precondition Required
    let resBody = {errors: [{message: 'No shot was queued to record. Queue one first.'}]}
    if (inMemory.shot && inMemory.shotState !== 'Recording') {
      inMemory.shotState = 'Recording'
      status = 200
      resBody = undefined
      setTimeout(() => {
        inMemory.shotState = 'Recorded'
      }, inMemory.shot.shotData.durationInSeconds * 1000)
    }
    res.status(status)
    res.jsonp(resBody)
  })

  server.post('/shot/approve', (req, res) => {
    let status = 428 // Precondition Required
    let resBody = {errors: [{message: 'No shot was recorded. Queue one first.'}]}
    if (inMemory.shot && inMemory.shotState === 'Recorded') {
      inMemory.shotState = 'Approved' // symbolic. we might use this later
      inMemory = newInMemory()
      status = 200
      resBody = undefined
      setTimeout(() => {
        inMemory.shotState = 'Recorded'
      }, 7000)
    }
    res.status(status)
    res.jsonp(resBody)
  })

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
  resetServer.listen(3002, '127.0.0.1')
})()
