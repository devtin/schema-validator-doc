import merge from 'deepmerge'

/**
 * @typedef {Object} JSONSchema
 * @desc The parsed schema into JSON
 * @private
 */

/**
 * Converts given schema in JSON format
 *
 * @param {Schema} schema
 * @param {Object} [options]
 * @param {String} [options.$name] - Name of the schema
 * @return {JSONSchema} JSON representation of given schema
 */
export function schemaValidatorToJSON (schema, { $name, includeAllSettings = false } = {}) {
  let plainSchema = {
    $name
  }
  schema.children.forEach(childSchema => {
    const settings = childSchema._settings

    if (!childSchema.hasChildren) {
      Object.assign(plainSchema, {
        [childSchema.name]: {
          settings,
          type: childSchema.type,
        }
      })
      if (includeAllSettings) {
        plainSchema = merge(plainSchema, { [childSchema.name]: { allSettings: childSchema.settings } })
      }
      return
    }

    Object.assign(plainSchema, {
      [childSchema.name]: Object.assign(schemaValidatorToJSON(childSchema, { includeAllSettings }), {
        $type: childSchema.cloned ? 'Schema' : 'Object',
        $name: childSchema.originalName,
        $settings: settings
      })
    })
  })
  return plainSchema
}
