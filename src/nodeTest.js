console.log(__dirname.replace(/\\/g, '/').indexOf('/src'))

console.log(__dirname.substring(0, __dirname.indexOf('\\src')) + '/src/assets/icon')
const url = __dirname.substring(0, __dirname.indexOf('\\src')) + '/src/assets/'
const icon = require(`${url}/${'pzgl.svg'}`)
console.log('icon', icon)
