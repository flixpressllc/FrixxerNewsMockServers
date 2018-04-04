const fs = require('fs')
const path = require('path')
const eol = require('eol')

const filesToEnsureUnixEndings = ['bin/frixxer-news-mock-servers']

function convertToUnix (file) {
  fs.readFile(file, 'utf8', (err, text) => {
    if (err) {
      return console.log(err)
    }
    const result = eol.lf(text)

    fs.writeFile(file, result, 'utf8', (err) => {
      if (err) return console.log(err)
    })
  })
}

filesToEnsureUnixEndings.forEach(file => convertToUnix(path.join(__dirname, file)))
