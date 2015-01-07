var crypto = require('crypto')
var path = require('path')
var proc = require('child_process')
var fs = require('fs')
var after = require('after-all')
var normalize = require('normalize-git-url')

var HOME = process.env.HOME || process.env.USERPROFILE

var enc = function(remote) {
  remote = remote.replace(/git\+ssh:\/\//, '')
  var result = remote.replace(/[^\w]+/g, '-')
  return result + '-' + crypto.createHash('sha1').update(remote).digest('hex').slice(0,8)
}

var resolve = function(url, cb) {
  var tag = url.split('#')[1] || 'master'
  var base = url.split('#')[0]

  var cwds = [enc(normalize(url).url), enc(base)].map(function(p) {
    return path.join(HOME, '.npm/_git-remotes', p)
  })

  var cmd = 'git rev-parse '+JSON.stringify(tag)

  proc.exec(cmd, {cwd:cwds[0]}, function(err, stdout) {
    if (stdout) return cb(null, base+'#'+stdout.trim())
    proc.exec(cmd, {cwd:cwds[1]}, function(err, stdout) {
      if (err) return cb(null, url)
      cb(null, base+'#'+stdout.trim())
    })
  })
}

module.exports = function(pkg, cb) {
  var clone = JSON.parse(JSON.stringify(pkg))

  var next = after(function() {
    cb(null, clone)
  })

  var ondep = function(map, dep) {
    var url = map[dep]    
    if (!url || !/^git[+:]/.test(url)) return

    var cb = next()
    resolve(url, function(err, resolved) {
      if (err) return cb(err)
      map[dep] = resolved
      cb()
    })

  }

  Object.keys(clone.dependencies || {}).forEach(function(dep) {
    ondep(clone.dependencies, dep)
  })

  Object.keys(clone.devDependencies || {}).forEach(function(dep) {
    ondep(clone.devDependencies, dep)
  })
}