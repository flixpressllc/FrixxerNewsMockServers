module.exports = {
  getMyIpAddress: () => {
    var os = require('os')
    var ifaces = os.networkInterfaces()
    var finalAddress = null

    Object.keys(ifaces).forEach(function (ifname) {
      ifaces[ifname].forEach(function (iface, alias) {
        if (iface.family !== 'IPv4' || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          finalAddress = iface.address ? iface.address : finalAddress
        } else {
          // this interface has only one ipv4 adress
          finalAddress = iface.address ? iface.address : finalAddress
        }
      })
    })
    return finalAddress
  }
}
