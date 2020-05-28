import Handlebars from 'handlebars'
import yaml from 'yamljs'
import fs from 'fs'
import pkgUp from 'pkg-up'
import path from 'path'
import trim from 'lodash/trim'

export const TypeUrlMap = {
  Array: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array`,
  BigInt: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt`,
  Boolean: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean`,
  Date: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date`,
  Function: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function`,
  Number: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number`,
  Object: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object`,
  String: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String`,
  Set: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set`
}

export function getTypeUrl (type) {
  if (TypeUrlMap[type]) {
    return TypeUrlMap[type]
    // return `https://github.com/devtin/schema-validator/blob/master/guide/TRANSFORMERS.md#${ type }`
  }
}

const loadPartial = name => {
  return fs.readFileSync(path.join(pkgUp.sync({ cwd: __dirname }), `../templates/partial/${ name }.hbs`)).toString()
}

Handlebars.registerHelper('fn', c => {
  if (!c) {
    return
  }
  if (typeof c === 'function') {
    return `\`<${ c.name }>\``
  }
  if (typeof c === 'object') {
    return `\`${ JSON.stringify(c) }\``
  }
  return c
})

const Yaml = c => {
  return c !== null && typeof c === 'object' && Object.keys(c).length > 0 ? trim(yaml.stringify(JSON.parse(JSON.stringify(c)))).replace(/\n/g, `<br>`) : '--'
}

Handlebars.registerHelper('yaml', Yaml)

Handlebars.registerHelper('settings', s => {
  if (typeof s === 'object' && s) {
    s = Object.assign({}, s)
    delete s.required
    delete s.default
  }

  return Yaml(s)
})

Handlebars.registerHelper('type', t => {
  const typeUrl = getTypeUrl(t)
  return typeUrl ? `[${ t }](${ typeUrl })` : t
})

Handlebars.registerHelper('boolean', t => {
  return !!t ? '*' : ''
})

Handlebars.registerPartial('property-header', loadPartial('property-header'))
Handlebars.registerPartial('property', loadPartial('property'))
Handlebars.registerPartial('schema', loadPartial('schema'))

export default Handlebars.compile(`{{> schema }}\n`)
