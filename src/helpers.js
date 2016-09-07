import extend from 'extend';

export function bindInstances(data) {
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

function applyEntityConstructor(field, data) {

  const Type = field.ref;

  if (field.type === 'array') {
    return Array.isArray(data) ? data.map(instance => new Type(instance)) : undefined;
  }

  return new Type(data);
};

function createGetterAndSetter(instance, field) {
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

export function generateValidateSchema(schemaObj) {

  const schema = extend(true, {}, schemaObj);
  let validateSchema = {};
  let field;

  for (field in  schema) {
    let attr = schema[field];
    if (attr.ref) {
      if (attr.type === 'array') {
        validateSchema[field] = attr;
        validateSchema[field].items = [attr.ref.validateSchema];
        delete validateSchema[field].ref;
      }
      else {
        validateSchema[field] = attr.ref.validateSchema;
      }
    }
    else {
      validateSchema[field] = attr;
    }
  }
  return validateSchema;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default {
  bindInstances: bindInstances,
  generateValidateSchema: generateValidateSchema,
  clone: clone
};


