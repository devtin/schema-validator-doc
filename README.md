<div><h1>@devtin/schema-validator-doc</h1></div>

<p>
    <a href="https://www.npmjs.com/package/@devtin/schema-validator-doc" target="_blank"><img src="https://img.shields.io/npm/v/@devtin/schema-validator-doc.svg" alt="Version"></a>
<a href="http://opensource.org/licenses" target="_blank"><img src="http://img.shields.io/badge/License-MIT-brightgreen.svg"></a>
</p>

<p>
    Converts a `@devtin/schema-validator` instance into JSON
</p>

## Installation

```sh
$ npm i @devtin/schema-validator-doc --save
# or
$ yarn add @devtin/schema-validator-doc
```



<br><a name="schemaValidatorToJSON"></a>

## schemaValidatorToJSON(schema, [options]) ⇒ <code>JSONSchema</code>

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Schema</code> |  |
| [options] | <code>Object</code> |  |
| [options.$name] | <code>String</code> | Name of the schema |

**Returns**: <code>JSONSchema</code> - JSON representation of given schema  
**Description:**

Converts given schema in JSON format


<br><a name="schemaValidatorToMarkdown"></a>

## schemaValidatorToMarkdown(jsonSchema) ⇒ <code>String</code>

| Param | Type |
| --- | --- |
| jsonSchema | <code>Array.&lt;JSONSchema&gt;</code>, <code>JSONSchema</code> | 

**Returns**: <code>String</code> - Markdown representation  

* * *

### License

[MIT](https://opensource.org/licenses/MIT)

&copy; 2020-present Martin Rafael Gonzalez <tin@devtin.io>
