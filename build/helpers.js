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

function applyEntityConstructor(field, data) {
  var Type = field.ref;

  if (field.type === 'array') {
    return Array.isArray(data) ? data.map(function (instance) {
      return new Type(instance);
    }) : undefined;
  }

  return new Type(data);
}

function createGetterAndSetter(instance, field) {
  return {
    set: function set(value) {
      if (instance.data[field] !== value) {
        instance.data[field] = value; //eslint-disable-line
        // instance._validate();
      }
    },
    get: function get() {
      return instance.data[field];
    },
    enumerable: true
  };
}

function bindInstances(data) {
  var _this = this;

  var newData = {};

  Object.keys(this.schema).forEach(function (field) {
    newData[field] = data[field] || _this.schema[field].defaultValue;

    if (_this.schema[field].ref) {
      newData[field] = applyEntityConstructor(_this.schema[field], newData[field]);
    }

    Object.defineProperty(_this, field, createGetterAndSetter(_this, field));
  });
  return newData;
}

function generateValidateSchema(schemaObj) {
  var schema = (0, _extend2.default)(true, {}, schemaObj);
  var validateSchema = {};

  Object.keys(schema).forEach(function (field) {
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
  });
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