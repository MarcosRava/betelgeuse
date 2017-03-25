import Ajv from 'ajv';
import { bindInstances, generateValidateSchema, clone } from './helpers';
import _Types from './Types';

const ajv = new Ajv({ allErrors: true });

export default class Betelgeuse {
  constructor(data) {
    this.constructor.normalizeSchema();

    Object.defineProperty(this, 'schema', {
      value: this.constructor.schema,
      enumerable: false,
      writable: false,
    });

    Object.defineProperty(this, 'data', {
      value: bindInstances.bind(this)(data || {}),
      enumerable: false,
    });
  }

  static get validateSchema() {
    if (this.validateSchemaSingeton) {
      return this.validateSchemaSingeton;
    }

    this.normalizeSchema();

    const properties = generateValidateSchema(this.schema);

    const property = {
      enumerable: false,
      value: {
        name: this.name,
        type: 'object',
        properties,
      },
      writable: false,
    };

    Object.defineProperty(this, 'validateSchemaSingeton', property);

    return this.validateSchemaSingeton;
  }
  fetch() {
    return this.data;
  }

  validate() {
    const ajValidate = ajv.compile(this.constructor.validateSchema);
    const valid = ajValidate(clone(this.data));
    if (!valid) {
      const errors = [];
      ajValidate.errors.forEach((error) => {
        errors.push({
          message: error.message,
          field: error.dataPath.substr(1),
        });
      });
      return Promise.reject(errors);
    }
    return Promise.resolve();
  }
}

Betelgeuse.normalizeSchema = function normalizeSchema() {
  if (this.validateSchemaSingeton) {
    return;
  }
  Object.keys(this.schema).forEach((field) => {
    if (typeof this.schema[field] === 'string') {
      this.schema[field] = { type: this.schema[field] };
    } else if (typeof this.schema[field].items === 'string') {
      this.schema[field].items = { type: this.schema[field].items };
    }
  });
};


export const Types = new _Types(Betelgeuse);

Betelgeuse.Types = Types;
