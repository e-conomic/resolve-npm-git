#!/usr/bin/env node

var resolve = require('./')
var path = require('path')
var fs = require('fs')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2), {alias:{file:'f', replace:'r'}})
var file = argv.file || require(path.join(process.cwd(), 'package.json'))

resolve(file, function(err, pkg) {
  if (err) throw err
  if (argv.replace) fs.writeFileSync(file, JSON.stringify(pkg, null, 2))
  else console.log(JSON.stringify(pkg, null, 2))
})