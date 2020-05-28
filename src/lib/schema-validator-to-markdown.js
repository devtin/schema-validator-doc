import { default as docCompiler, TypeUrlMap } from './doc-templates.js'
import forEach from 'lodash/forEach.js'

export function schemaProperties2Array (jsonSchema, prefix = []) {
  const properties = []

  Object.keys(jsonSchema).forEach(prop => {
    const child = jsonSchema[prop]
    if (typeof child !== 'object') {
      return
    }

    if (!child.type) {
      return properties.push(...schemaProperties2Array(child, prefix.concat(prop)))
    }

    const { type, settings, allSettings } = child

    properties.push({
      name: prefix.concat(prop).join('.'),
      type,
      settings,
      allSettings
    })
  })

  return properties
}

export function breakdownNestedSchemas (schema) {
  const schemas = []
  const isSchemaNameInSchemas = name => {
    if (!name) {
      return false
    }
    let found = false
    forEach(schemas, schema => {
      if (schema.$name === name) {
        found = true
        return false
      }
    })
    return found
  }

  const appendInSchemas = newSchemas => {
    schemas.push(...newSchemas.filter(({ $name }) => !isSchemaNameInSchemas($name)))
  }

  const loopIntoSchema = oldSchema => {
    const newSchema = {}
    Object.keys(oldSchema).forEach(prop => {
      const child = oldSchema[prop]

      if (/^\$/.test(prop)) {
        return Object.assign(newSchema, { [prop]: child })
      }

      if (child.$type === 'Schema') {
        TypeUrlMap[child.$name] = `#${ child.$name }`
        newSchema[prop] = {
          type: child.$name,
          $settings: child.$settings
        }
        const nestedChild = Object.assign({}, child)
        delete nestedChild.$type
        delete nestedChild.$settings
        return appendInSchemas(breakdownNestedSchemas(nestedChild))
      } else if (child.type) {
        newSchema[prop] = child
      } else if (typeof child === 'object') {
        newSchema[prop] = loopIntoSchema(child)
      }
    })
    // console.log({ newSchema })
    return newSchema
  }

  schemas.push(loopIntoSchema(schema))
  return schemas
}

/**
 *
 * @param {JSONSchema[]|JSONSchema} jsonSchema
 * @return {String} Markdown representation
 */
export function schemaValidatorToMarkdown (jsonSchema) {
  if (Array.isArray(jsonSchema)) {
    return jsonSchema.map(schemaValidatorToMarkdown).join(`\n`)
  }

  const schemas = breakdownNestedSchemas(jsonSchema)
  return schemas.map(schema => {
    return docCompiler({
      name: schema.$name,
      properties: schemaProperties2Array(schema)
    })
  }).join(`\n`)
}
