const request = require('request')
const { getMyIpAddress } = require('./ipAddressHelpers')

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

function deleteShot(shotId, db) {
  if (!db.shots.find(shot => shot.id === shotId)) {
    return false
  }
  const segment = db.segments.find(s => s.relationships.shots.some(shot => shot.id === shotId))
  segment.relationships.shots = segment.relationships.shots.filter(shot => shot.id !== shotId)
  db.shots = db.shots.filter(shot => shot.id !== shotId)
  return true
}

function deleteSegment(segmentId, db) {
  const segment = db.segments.find(segment => segment.id === segmentId)
  if (!segment) {
    return false
  }
  segment.relationships.shots.forEach(shot => {
    deleteShot(shot.id, db)
  })
  const newscast = db.newscasts.find(s => s.relationships.segments.some(segment => segment.id === segmentId))
  newscast.relationships.segments = newscast.relationships.segments.filter(segment => segment.id !== segmentId)
  db.segments = db.segments.filter(segment => segment.id !== segmentId);
  return true
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
  getPackageIdsForSelfFulfillment: (lodashWrappedDb) => {
    return (req, res) => {
      const db = lodashWrappedDb.getState()
      const packageData = db.packages.filter(p => p.isOrdered === true && p.url == null)
      res.jsonp({ data: packageData.map(p => p.id) })
    }
  },
  getUnfulfilledShots: (lodashWrappedDb) => {
    return (req, res) => {
      const db = lodashWrappedDb.getState()
      const newscasts = db.packages
        .filter(p => p.isOrdered === true)
        .map(p => db.newscasts.find(n => p.relationships.newscast.id === n.id))
      const segmentIds = newscasts
        .map(n => n.relationships.segments)
        .reduce((a, c) => a.concat(c), [])
        .map(s => s.id)
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
  getUnfulfilledShotIdsByPackage: (lodashWrappedDb) => {
    return (req, res) => {
      const db = lodashWrappedDb.getState()
      const newscastId = db.packages
        .find(p => p.id.toString() === req.params.id).relationships.newscast.id
      const newscast = db.newscasts.find(n => n.id === newscastId)
      const segmentIds = newscast.relationships.segments
        .reduce((a, c) => a.concat(c), [])
        .map(seg => seg.id)
      const shots = segmentIds
        .map(id => db.shots.filter(shot => {
          const isInSegment = shot.relationships.segment.id === id
          const hasCopy = shot.shotData.inputValues.find(iv => iv.name === 'copy')
          return (isInSegment && hasCopy)
        }))
        .reduce((a, c) => a.concat(c), [])
      res.jsonp({data: shots.map(s => s.id)})
    }
  },
  getPreviewUrl: getPreviewUrl,
  getLocalIpAddress: (lodashWrappedDb) => (req, res) => {
    const db = lodashWrappedDb.getState()
    res.jsonp({data: db.studiomachines[0].localIpAddress})
  },
  studioMachineReport: (lodashWrappedDb) => (req, res) => {
    const db = lodashWrappedDb.getState()
    const ip = req.body.localIpAddress
    db.studiomachines[0].localIpAddress = ip
    res.end()
  },
  deleteShot: (lodashWrappedDb) => (req, res, next) => {
    const shotId = parseInt((req.params.id), 10)
    const db = lodashWrappedDb.getState()
    if (deleteShot(shotId, db)) {
      res.statusCode = 204
      res.end()
    } else {
      res.statusCode = 404
      res.end()
    }
  },
  deleteSegment: (lodashWrappedDb) => (req, res, next) => {
    const segmentId = parseInt((req.params.id), 10)
    const db = lodashWrappedDb.getState()
    if (deleteSegment(segmentId, db)) {
      res.statusCode = 204
      res.end()
    } else {
      res.statusCode = 404
      res.end()
    }
  },
  getTemplates: (lodashWrappedDb) => (req, res) => {
    req.runMiddleware(`/templates/`, (code, body) => {
      res.statusCode = code
      let records = JSON.parse(body).data
      records = records.map(template => {
        const {id, type, name, imageUrl, previewUrl} = template
        return {id, type, name, imageUrl, previewUrl}
      })
      console.warn('not supplying real pagination')
      res.jsonp({data: {records}})
    })    
  },
}
