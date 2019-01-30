const fs = require('fs')
const path = require('path')

const pkgPath = path.join(__dirname, '../package.json')
const productPath = path.join(__dirname, '../product.json')
const pkg = require(pkgPath)

function generateProductInfo () {
  const product = {
    version: pkg.version,
    commit: require('child_process')
      .execSync('git rev-parse HEAD')
      .toString()
      .trim()
  }
  fs.writeFileSync(productPath, JSON.stringify(product))
}

generateProductInfo()
