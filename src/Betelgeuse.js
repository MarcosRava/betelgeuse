import Ajv from 'ajv';
import { bindInstances, generateValidateSchema, clone } from './helpers';
import _Types from './Types';

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
    let field;
    for (field in this.schema) {
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
    const valid = ajValidate(clone(this.data));
    if (!valid) {
      let errors = [];
      let i;
      for (i in ajValidate.errors) {
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

export const Types = new _Types(Betelgeuse);

Betelgeuse.Types = Types;
