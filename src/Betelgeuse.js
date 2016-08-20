var Ajv = require('ajv');
var ajv = new Ajv();

const applyEntityConstructor = (field, data) => {
//       if (!data) return;

  const Type = field.ref;

//      if(field.builder) {
//        return field.builder(data, Type);
//      }

//      if (Array.isArray(data)) {
//        return data.map(instance => new Type(instance));
//      }

  return new Type(data);
}
const createGetterAndSetter = (instance, field) => {
  return {
    set: function (value){
      if(instance.data[field] !== value) {
        instance.data[field] = value;
        return instance._validate();
      }
    },
    get: function (){ return instance.data[field]; },
    enumerable: true
  }
}

class Betelgeuse {


  constructor(data) {

    //this.constructor.getValidateSchema(),

    Object.defineProperty(this, 'schema', {
      value: this.constructor.schema,
      enumerable: false
    });

    Object.defineProperty(this, 'presenter', {
      value: this.constructor.presenter,
      enumerable: false
    });

    Object.defineProperty(this, 'childrenEntities', {
      value: Object.keys(this.constructor.schema).filter((field) => !!this.constructor.schema[field].ref),
      enumerable: false
    });

    Object.defineProperty(this, 'data', {
      value: this._mergeDefault(data || {}),
      enumerable: false
    });

  }

  static parseSchema() {
    for (let field in this.schema) {
      if (typeof this.schema[field] === 'string') {
        this.schema[field] = {type: this.schema[field]}
      }
    }
  }

  static fromPresenter(data) {
    let rawData = {};
    let presenterProperties = this._getFromPresenterFields();

    for (let field in data) {
      rawData[presenterProperties[field] || field] = data[field];
    }
    return new this(rawData);
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
    Object.defineProperty(this, '_validateSchema', {enumerable: false, value: {properties: validateSchema}, writable: false});
    return this._validateSchema;
  }

  static _getFromPresenterFields() {
    let fields = {};
    let presenter = this.presenter || {};
    let properties = presenter.properties || {};
    for (let field in properties) {
      fields[properties[field]] = field;
    }
    return fields
  }

  fetch() {
    return this.data;
  }

  isValid() {
    let validate = ajv.compile(this.constructor.validateSchema);
    let valid = validate(this.data);
    if (!valid) {
      let errors = [];
      for (let i in validate.errors) {
        let error = validate.errors[i];
        errors.push({
          message: error.message,
          field: error.dataPath.substr(1)
        });
      }
      return errors;
    }
    console.log(this.data,valid);
  }

  toPresenter() {
    let rawData = {};
    let presenter = this.presenter || {};
    let properties = presenter.properties || {};
    let fields = this._getPresenterFields();
    for(let i in fields) {
      let field = fields[i];
      rawData[properties[field] || field] = this[field]
    }

    return rawData;
  }

  _getPresenterFields() {
    let fields = [];
    let presenter = this.presenter;
    let exclude = presenter.exclude || [];
    //let include = presenter.include || [];
    for(let field in this.schema) {
      if (exclude.indexOf(field) === -1) {
        fields.push(field);
      }
    }
    return fields;
  }

  _mergeDefault(data) {
    const newData = {};
    let field;
    for(field in this.schema){

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
  integer: "integer",
  number: "number",
  boolean: "boolean",
  string: "string"
};

export const Types = Betelgeuse.Types;
export default Betelgeuse;
