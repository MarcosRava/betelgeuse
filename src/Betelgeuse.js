'use strict';

import Promise from 'bluebird';

const Ajv = require('ajv');
const ajv = new Ajv();

const applyEntityConstructor = function applyEntityConstructor(field, data) {
//       if (!data) return;

  const Type = field.ref;

//      if(field.builder) {
//        return field.builder(data, Type);
//      }

//      if (Array.isArray(data)) {
//        return data.map(instance => new Type(instance));
//      }

  return new Type(data);
};

const createGetterAndSetter = function createGetterAndSetter(instance, field) {
  return {
    set: function (value){
      if(instance.data[field] !== value) {
        instance.data[field] = value;
        return instance._validate();
      }
    },
    get: function (){ return instance.data[field]; },
    enumerable: true
  };
};

class Betelgeuse {

  constructor(data) {

    this.constructor.parseSchema();

    Object.defineProperty(this, 'schema', {
      value: this.constructor.schema,
      enumerable: false,
      writable: false
    });

    Object.defineProperty(this, 'childrenEntities', {
      value: Object.keys(this.constructor.schema)
        .filter((field) => !!this.constructor.schema[field].ref),
      enumerable: false,
      writable: false
    });

    Object.defineProperty(this, 'data', {
      value: this._mergeDefault(data || {}),
      enumerable: false
    });

  }

  static parseSchema() {
    for (let field in this.schema) {
      if (typeof this.schema[field] === 'string') {
        this.schema[field] = {type: this.schema[field]};
      }
    }
  }

  static get validateSchema () {
    if (this._validateSchema) {
      return this._validateSchema;
    }
    this.parseSchema();
    let validateSchema = {};
    for (let field in  this.schema) {
      let attr = this.schema[field];
      if (attr.ref) {
        validateSchema[field] = attr.ref.validateSchema;
      } else {
        validateSchema[field] = attr;
      }
    }
    const property = {
      enumerable: false,
      value: {
        properties: validateSchema
      },
      writable: false
    };
    Object.defineProperty(this, '_validateSchema', property);
    return this._validateSchema;
  }

  fetch() {
    return this.data;
  }

  validate() {
    const ajValidate = ajv.compile(this.constructor.validateSchema);
    const valid = ajValidate(this.data);
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

  _mergeDefault(data) {
    const newData = {};
    for(let field in this.schema){

      newData[field] = data[field] || this.schema[field].defaultValue;

      if (this.schema[field].ref) {
        newData[field] = applyEntityConstructor(this.schema[field], newData[field]);
      }

      Object.defineProperty(this, field, createGetterAndSetter(this, field));
    }
    return newData;
  }
}

Betelgeuse.Types = {
  integer: 'integer',
  number: 'number',
  boolean: 'boolean',
  string: 'string',
  array: 'array',
  ocject: 'object',
  arrayOf: (Type) => {
    return {
      type: 'array',
      ref: Type
    };
  }
};

export const Types = Betelgeuse.Types;
export default Betelgeuse;
