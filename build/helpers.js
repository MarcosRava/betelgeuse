'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindInstances = bindInstances;
exports.generateValidateSchema = generateValidateSchema;
exports.clone = clone;

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bindInstances(data) {
  var newData = {};
  var field = void 0;

  for (field in this.schema) {

    newData[field] = data[field] || this.schema[field].defaultValue;

    if (this.schema[field].ref) {
      newData[field] = applyEntityConstructor(this.schema[field], newData[field]);
    }

    Object.defineProperty(this, field, createGetterAndSetter(this, field));
  }
  return newData;
}

function applyEntityConstructor(field, data) {

  var Type = field.ref;

  if (field.type === 'array') {
    return Array.isArray(data) ? data.map(function (instance) {
      return new Type(instance);
    }) : undefined;
  }

  return new Type(data);
};

function createGetterAndSetter(instance, field) {
  return {
    set: function set(value) {
      if (instance.data[field] !== value) {
        instance.data[field] = value;
        return instance._validate();
      }
    },
    get: function get() {
      return instance.data[field];
    },
    enumerable: true
  };
};

function generateValidateSchema(schemaObj) {

  var schema = (0, _extend2.default)(true, {}, schemaObj);
  var validateSchema = {};
  var field = void 0;

  for (field in schema) {
    var attr = schema[field];
    if (attr.ref) {
      if (attr.type === 'array') {
        validateSchema[field] = attr;
        validateSchema[field].items = [attr.ref.validateSchema];
        delete validateSchema[field].ref;
      } else {
        validateSchema[field] = attr.ref.validateSchema;
      }
    } else {
      validateSchema[field] = attr;
    }
  }
  return validateSchema;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

exports.default = {
  bindInstances: bindInstances,
  generateValidateSchema: generateValidateSchema,
  clone: clone
};