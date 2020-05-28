import {
  schemaValidatorToMarkdown,
  schemaProperties2Array,
  breakdownNestedSchemas
} from './schema-validator-to-markdown.js'
import { schemaValidatorToJSON } from './schema-validator-to-json.js'
import test from 'ava'
import path from 'path'
import fs from 'fs'
import { UserSchema } from './benchmark/complex.input.js'

test(`Converts schema json into array`, t => {
  t.true(Array.isArray(schemaProperties2Array(schemaValidatorToJSON(UserSchema))))
})

test(`Breakdown nested schemas`, t => {
  const schemas = breakdownNestedSchemas(schemaValidatorToJSON(UserSchema, { $name: 'UserSchema' }))
  t.true(Array.isArray(schemas))
  t.is(schemas.length, 2)
  t.is(schemas[0].$name, 'AddressSchema')
})

test(`Converts schema into markdown`, t => {
  const expectedOutput = fs.readFileSync(path.join(__dirname, 'benchmark/complex.output.md')).toString()
  t.is(schemaValidatorToMarkdown(schemaValidatorToJSON(UserSchema, {
    $name: 'UserSchema',
    includeAllSettings: true
  })), expectedOutput)
})
