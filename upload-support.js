const multer = require('multer')
const { join } = require('path')
const serveStatic = require('express').static
const keepDir = join(__dirname, '..', 'uploads')
const sessionStorageDir = join(keepDir, 'tmp')
const mkdirp = require('mkdirp')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdirp(sessionStorageDir)
    cb(null, sessionStorageDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({
  storage: storage
})

function respondWithUploadResult (req, res, storagePath) {
  const runMidCallback = (code, body) => {
    const mediaFileId = JSON.parse(body).data.id

    res.jsonp({
      data: [{
        url: `${storagePath}/${req.files[0].filename}`,
        mediaFileId
      }]
    })
  }

  const runMidOptions = {
    method: 'post',
    body: {url: `${storagePath}/${req.files[0].filename}`}
  }

  req.runMiddleware('/media', runMidOptions, runMidCallback)
}

function uploadFile (storagePath) {
  return (req, res, next) => {
    const cb = (err) => {
      if (err) next(err)
      respondWithUploadResult(req, res, storagePath)
    }
    upload.any()(req, res, cb)
  }
}

function serveUploadedFiles (req, res, next) {
  serveStatic(sessionStorageDir)(req, res, (err) => {
    if (err) next(err)
    serveStatic(keepDir)(req, res, next)
  })
}

module.exports = {
  uploadFile,
  serveUploadedFiles
}
