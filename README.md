Archived
======
Tech Leads: Repository archived due to inactivity in more than 6 months.
Please remember to add a CODEOWNERS file to the root of the repository when unarchiving.

# resolve-npm-git

Resolve npm git dependencies to a git revision in a package.json.
Allows npm to cache the dependency properly when reinstalling

```
npm install resolve-npm-git
```

## Usage

``` js
var resolve = require('resolve-npm-git')
resolve(requre('./package.json'), function(err, resolved) {
  // all git dependencies in package.json that contain #{some-tag}
  // have been resolved to #{revision}
})
```

## Command line usage

```
npm install -g resolve-npm-git
cd some-node-module
resolve-npm-git # prints the resolved pkg json to stdout
```

To replace the package.json with the resolved one use the `-r` flag

```
resolve-npm-git --replace # replaces ./package.json with the resolved one
```

And to use another file than `./package.json` use the `-f` flag

```
resolve-npm-git --file ./some-modules/package.json
```

## License

MIT
