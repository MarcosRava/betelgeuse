import Ajv from 'ajv';
import { bindInstances, generateValidateSchema } from './helpers';

const ajv = new Ajv({allErrors: true});

export default class Betelgeuse {

  static get validateSchema () {

    if (this._validateSchema) {
      return this._validateSchema;
    }

    this.normalizeSchema();

    const validateSchema = generateValidateSchema(this.schema);

    const property = {
      enumerable: false,
      value: {
        name: this.name,
        type: 'object',
        properties: validateSchema
      },
      writable: false
    };

    Object.defineProperty(this, '_validateSchema', property);

    return this._validateSchema;
  }

  static normalizeSchema() {

    if (this._validateSchema) {
      return;
    }

    for (let field in this.schema) {
      if (typeof this.schema[field] === 'string') {
        this.schema[field] = {type: this.schema[field]};
      }
      else if (typeof this.schema[field].items === 'string') {
        this.schema[field].items = {type: this.schema[field].items};
      }
    }
  }

  constructor(data) {

    this.constructor.normalizeSchema();

    Object.defineProperty(this, 'schema', {
      value: this.constructor.schema,
      enumerable: false,
      writable: false
    });

    Object.defineProperty(this, 'data', {
      value: bindInstances.bind(this)(data || {}),
      enumerable: false
    });

  }

  fetch() {
    return this.data;
  }

  validate() {
    const ajValidate = ajv.compile(this.constructor.validateSchema);
    const valid = ajValidate(JSON.parse(JSON.stringify(this.data)));
    if (!valid) {
      let errors = [];
      for (let i in ajValidate.errors) {
        let error = ajValidate.errors[i];
        errors.push({
          message: error.message,
          field: error.dataPath.substr(1)
        });
      }
      return errors;
    }

  }
}

export const Types = {
  integer: 'integer',
  number: 'number',
  boolean: 'boolean',
  string: 'string',
  array: 'array',
  object: 'object',
  arrayOf: function arrayOf(Type) {
    let schema = {
      type: 'array'
    };
    if (Type.prototype instanceof Betelgeuse) {
      schema.ref= Type;
    } else if (typeof Type === 'function') {
      schema.items = Type.name ? Type.name.toLowerCase() : Type.toString();
    } else if (typeof Type === 'string') {
      schema.items = Type;
    }
    return schema;
  },
  attributeOf: function attributeOf(Type, attr) {
    if (!Type.prototype instanceof Betelgeuse) {
      throw new Error('Must be an instance of Betelguese');
    }
    let schema = {};
    schema[attr] = Type.schema[attr];
    return schema;
  }
};

Betelgeuse.Types = Types;
