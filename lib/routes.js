const nextRoutes = require('next-routes')
const routes = nextRoutes()

routes
  .add('index', '/')
  .add('repo/edit', '/repo/:repoId*/edit')
  .add('repo/raw', '/repo/:repoId*/raw')
  .add('repo/tree', '/repo/:repoId*/tree')
  .add('repo/preview', '/repo/:repoId*/preview')
  .add('repo/publish', '/repo/:repoId*/publish')

module.exports = routes
