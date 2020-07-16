/*!
 * @devtin/schema-validator-doc v1.0.3
 * (c) 2020-2020 Martin Rafael Gonzalez <tin@devtin.io>
 * MIT
 */
import merge from 'deepmerge';
import Handlebars from 'handlebars';
import yaml from 'yamljs';
import fs from 'fs';
import pkgUp from 'pkg-up';
import path from 'path';
import trim from 'lodash/trim';
import forEach from 'lodash/forEach.js';

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
function schemaValidatorToJSON (schema, { $name, includeAllSettings = false } = {}) {
  let plainSchema = {
    $name
  };
  schema.children.forEach(childSchema => {
    const settings = childSchema._settings;

    if (!childSchema.hasChildren) {
      Object.assign(plainSchema, {
        [childSchema.name]: {
          settings,
          type: childSchema.type,
        }
      });
      if (includeAllSettings) {
        plainSchema = merge(plainSchema, { [childSchema.name]: { allSettings: childSchema.settings } });
      }
      return
    }

    Object.assign(plainSchema, {
      [childSchema.name]: Object.assign(schemaValidatorToJSON(childSchema, { includeAllSettings }), {
        $type: childSchema.cloned ? 'Schema' : 'Object',
        $name: childSchema.originalName,
        $settings: settings
      })
    });
  });
  return plainSchema
}

const TypeUrlMap = {
  Array: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array`,
  BigInt: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt`,
  Boolean: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean`,
  Date: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date`,
  Function: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function`,
  Number: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number`,
  Object: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object`,
  String: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String`,
  Set: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set`
};

function getTypeUrl (type) {
  if (TypeUrlMap[type]) {
    return TypeUrlMap[type]
    // return `https://github.com/devtin/schema-validator/blob/master/guide/TRANSFORMERS.md#${ type }`
  }
}

const loadPartial = name => {
  return fs.readFileSync(path.join(pkgUp.sync({ cwd: __dirname }), `../templates/partial/${ name }.hbs`)).toString()
};

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
});

const Yaml = c => {
  return c !== null && typeof c === 'object' && Object.keys(c).length > 0 ? trim(yaml.stringify(JSON.parse(JSON.stringify(c)))).replace(/\n/g, `<br>`) : '--'
};

Handlebars.registerHelper('yaml', Yaml);

Handlebars.registerHelper('settings', s => {
  if (typeof s === 'object' && s) {
    s = Object.assign({}, s);
    delete s.required;
    delete s.default;
  }

  return Yaml(s)
});

Handlebars.registerHelper('type', t => {
  const typeUrl = getTypeUrl(t);
  return typeUrl ? `[${ t }](${ typeUrl })` : t
});

Handlebars.registerHelper('boolean', t => {
  return t ? '*' : ''
});

Handlebars.registerPartial('property-header', loadPartial('property-header'));
Handlebars.registerPartial('property', loadPartial('property'));
Handlebars.registerPartial('schema', loadPartial('schema'));

var docCompiler = Handlebars.compile(`{{> schema }}\n`);

function schemaProperties2Array (jsonSchema, prefix = []) {
  const properties = [];

  Object.keys(jsonSchema).forEach(prop => {
    const child = jsonSchema[prop];
    if (typeof child !== 'object') {
      return
    }

    if (!child.type) {
      return properties.push(...schemaProperties2Array(child, prefix.concat(prop)))
    }

    const { type, settings, allSettings } = child;

    properties.push({
      name: prefix.concat(prop).join('.'),
      type,
      settings,
      allSettings
    });
  });

  return properties
}

function breakdownNestedSchemas (schema) {
  const schemas = [];
  const isSchemaNameInSchemas = name => {
    if (!name) {
      return false
    }
    let found = false;
    forEach(schemas, schema => {
      if (schema.$name === name) {
        found = true;
        return false
      }
    });
    return found
  };

  const appendInSchemas = newSchemas => {
    schemas.push(...newSchemas.filter(({ $name }) => !isSchemaNameInSchemas($name)));
  };

  const loopIntoSchema = oldSchema => {
    const newSchema = {};
    Object.keys(oldSchema).forEach(prop => {
      const child = oldSchema[prop];

      if (/^\$/.test(prop)) {
        return Object.assign(newSchema, { [prop]: child })
      }

      if (child.$type === 'Schema') {
        TypeUrlMap[child.$name] = `#${ child.$name }`;
        newSchema[prop] = {
          type: child.$name,
          $settings: child.$settings
        };
        const nestedChild = Object.assign({}, child);
        delete nestedChild.$type;
        delete nestedChild.$settings;
        return appendInSchemas(breakdownNestedSchemas(nestedChild))
      } else if (child.type) {
        newSchema[prop] = child;
      } else if (typeof child === 'object') {
        newSchema[prop] = loopIntoSchema(child);
      }
    });
    // console.log({ newSchema })
    return newSchema
  };

  schemas.push(loopIntoSchema(schema));
  return schemas
}

/**
 *
 * @param {JSONSchema[]|JSONSchema} jsonSchema
 * @return {String} Markdown representation
 */
function schemaValidatorToMarkdown (jsonSchema) {
  if (Array.isArray(jsonSchema)) {
    return jsonSchema.map(schemaValidatorToMarkdown).join(`\n`)
  }

  const schemas = breakdownNestedSchemas(jsonSchema);
  return schemas.map(schema => {
    return docCompiler({
      name: schema.$name,
      properties: schemaProperties2Array(schema)
    })
  }).join(`\n`)
}

export { schemaValidatorToJSON, schemaValidatorToMarkdown };
