const request = require('request')

class Shot {
  constructor (shotLayout) {
    this.type = 'shots'
    this.shotData = {}
    this.relationships = {
      shotLayout: {type: 'shot-layouts', id: shotLayout.id},
      segment: null
    }
    this.shotData.durationInSeconds = shotLayout.definition.minimumDurationInSeconds
    this.shotData.inputValues = shotLayout.definition.inputDefinitions.map(def => ({
      name: def.name,
      values: def.defaultValues
    }))
  }
}

class Newscast {
  constructor () {
    this.type = 'newscasts'
    this.title = ''
    this.relationships = {
      segments: []
    }
  }
}

class Segment {
  constructor ({segmentTypeId}) {
    this.type = 'segments'
    this.title = ''
    this.relationships = {
      segmentType: {type: 'segment-types', id: parseInt(segmentTypeId, 10)},
      shots: []
    }
  }
}

class SegmentType {
  constructor () {
    this.type = 'segment-types'
    this.name = ''
    this.hasAudio = false
    this.isGlobal = false
    this.relationships = {
      shotFilters: []
    }
  }
}

class ShotLayout {
  constructor () {
    this.type = 'shot-layouts'
    this.name = ''
    this.requiresFilming = false
    this.definition = {
      inputDefinitions: [],
      minimumDurationInSeconds: 3,
      maximumDurationInSeconds: 10,
      defaultDurationInSeconds: 3
    }
  }
}

class ShotLayoutTag {
  constructor () {
    this.type = 'shot-layout-tags'
    this.name = ''
  }
}

class Package {
  constructor ({packageTemplateId}) {
    this.type = 'packages'
    this.title = ''
    this.durationInSeconds = 180
    this.relationships = {
      newscast: null,
      peripherals: [],
      packageTemplate: {type: 'package-templates', id: parseInt(packageTemplateId, 10)}
    }
  }
}

class PackageTemplate {
  constructor () {
    this.type = 'package-templates'
    this.name = ''
    this.peripheralDefinitions = []
  }
}

function formatResponseAsRawRenderer (url) {
  return {
    data: [
      {
        status: 'success',
        files: [
          {
            resolution: '360p',
            fileExtension: 'mp4',
            url: url,
            isRendered: true
          }
        ]
      }
    ]
  }
}

function formatResponseAsFrixxerPreview (url) {
  return {
    data: url
  }
}

function getPreviewUrl () {
  function genUrl () {
    const min = 1
    const max = 159
    const rand = Math.floor(Math.random() * (max - min + 1) + min)
    return `https://mediarobotvideo.s3.amazonaws.com/sm/Template${rand}.mp4`
  }
  function getFakeUrl (url) {
    if (!url) return getFakeUrl(genUrl())
    return new Promise((resolve) => {
      request(url, (err, response) => {
        if (!err && response.statusCode === 200) {
          resolve(url)
        } else {
          resolve(getFakeUrl(genUrl()))
        }
      })
    })
  }
  return getFakeUrl()
}

module.exports = {
  getNewShot: (req, res) => {
    req.runMiddleware(`/shotlayouts/${req.params.id}`, (code, body) => {
      // console.log(body)
      const shotLayoutData = JSON.parse(body).data
      res.jsonp({data: new Shot(shotLayoutData)})
    })
  },
  getNewNewscast: (req, res) => {
    res.jsonp({data: new Newscast()})
  },
  getNewSegment: (req, res) => {
    res.jsonp({data: new Segment({segmentTypeId: req.params.id})})
  },
  getNewSegmentType: (req, res) => {
    res.jsonp({data: new SegmentType()})
  },
  getNewShotLayout: (req, res) => {
    res.jsonp({data: new ShotLayout()})
  },
  getNewShotLayoutTag: (req, res) => {
    res.jsonp({data: new ShotLayoutTag()})
  },
  getNewPackageTemplate: (req, res) => {
    res.jsonp({data: new PackageTemplate()})
  },
  getNewPackage: (req, res) => {
    res.jsonp({data: new Package({packageTemplateId: req.params.id})})
  },
  previewShotData: (req, res) => {
    getPreviewUrl().then(url => {
      res.jsonp(formatResponseAsRawRenderer(url))
    })
  },
  previewNewscast: (req, res) => {
    getPreviewUrl().then(url => {
      res.jsonp(formatResponseAsFrixxerPreview(url))
    })
  },
  previewSegment: (req, res) => {
    getPreviewUrl().then(url => {
      res.jsonp(formatResponseAsFrixxerPreview(url))
    })
  },
  orderPackage: (lodashWrappedDb) => {
    return (req, res) => {
      const db = lodashWrappedDb.getState()
      const pId = req.params.id
      const packageData = db.packages.find(p => { p.id = pId })
      packageData.isOrdered = true
      lodashWrappedDb.setState(db)
      res.jsonp(packageData)
    }
  },
  getComplete: (lodashWrappedDb) => {
    return (req, res) => {
      const db = lodashWrappedDb.getState()
      const packageData = db.packages.filter(p => p.url != null)
      res.jsonp({data: packageData})
    }
  },
  getPending: (lodashWrappedDb) => {
    return (req, res) => {
      const db = lodashWrappedDb.getState()
      const packageData = db.packages.filter(p => p.isOrdered === true && p.url == null)
      res.jsonp({data: packageData})
    }
  },
  getUnfulfilledShots: (lodashWrappedDb) => {
    return (req, res) => {
      const db = lodashWrappedDb.getState()
      const newscastIds = db.packages
        .filter(p => p.isOrdered === true)
        .map(p => p.relationships.newscast.id)
      const segmentIds = newscastIds
        .map(id => db.segments.filter(seg => seg.id === id))
        .reduce((a, c) => a.concat(c), [])
        .map(seg => seg.id)
      const shots = segmentIds
        .map(id => db.shots.filter(shot => {
          const isInSegment = shot.relationships.segment.id === id
          const hasCopy = shot.shotData.inputValues.find(iv => iv.name === 'copy')
          return (isInSegment && hasCopy)
        }))
        .reduce((a, c) => a.concat(c), [])
      res.jsonp({data: shots})
    }
  },
  getPreviewUrl: getPreviewUrl
}
