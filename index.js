function runMainApp () {
  require('./app/app-main')
}

process.getCommit = () => {
  if (process.env.npm_package_gitHead) return process.env.npm_package_gitHead
  return require('./product.json').commit
}

process.getVersion = () => {
  if (process.env.npm_package_version) return process.env.npm_package_version
  return require('./product.json').version
}

runMainApp()
