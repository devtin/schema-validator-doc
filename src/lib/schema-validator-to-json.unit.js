import { schemaValidatorToJSON } from './schema-validator-to-json.js'
import { UserSchema } from './benchmark/complex.input.js'
import test from 'ava'

test(`Converts a schema instance into a JSON representation`, t => {
  const jsonSchema = schemaValidatorToJSON(UserSchema, { includeAllSettings: true })
  t.is(jsonSchema.name.type, 'String')
  t.is(jsonSchema.birthday.type, 'Date')
  t.is(jsonSchema.address.$name, 'AddressSchema')
  t.is(jsonSchema.address.$type, 'Schema')
  t.is(jsonSchema.address.state.type, 'String')
  t.is(jsonSchema.address.state.settings.default, 'Florida')
  t.is(jsonSchema.address.zip.type, 'Number')
  t.is(jsonSchema.address.line1.type, 'String')
  t.is(jsonSchema.created.type, 'Date')
  t.true(typeof jsonSchema.created.settings.default === 'function')
})
