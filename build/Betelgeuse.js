'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Types = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ajv = new _ajv2.default({ allErrors: true });

var Betelgeuse = function () {
  _createClass(Betelgeuse, null, [{
    key: 'normalizeSchema',
    value: function normalizeSchema() {

      if (this._validateSchema) {
        return;
      }

      for (var field in this.schema) {
        if (typeof this.schema[field] === 'string') {
          this.schema[field] = { type: this.schema[field] };
        } else if (typeof this.schema[field].items === 'string') {
          this.schema[field].items = { type: this.schema[field].items };
        }
      }
    }
  }, {
    key: 'validateSchema',
    get: function get() {

      if (this._validateSchema) {
        return this._validateSchema;
      }

      this.normalizeSchema();

      var validateSchema = (0, _helpers.generateValidateSchema)(this.schema);

      var property = {
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
  }]);

  function Betelgeuse(data) {
    _classCallCheck(this, Betelgeuse);

    this.constructor.normalizeSchema();

    Object.defineProperty(this, 'schema', {
      value: this.constructor.schema,
      enumerable: false,
      writable: false
    });

    Object.defineProperty(this, 'data', {
      value: _helpers.bindInstances.bind(this)(data || {}),
      enumerable: false
    });
  }

  _createClass(Betelgeuse, [{
    key: 'fetch',
    value: function fetch() {
      return this.data;
    }
  }, {
    key: 'validate',
    value: function validate() {
      var ajValidate = ajv.compile(this.constructor.validateSchema);
      var valid = ajValidate(JSON.parse(JSON.stringify(this.data)));
      if (!valid) {
        var errors = [];
        for (var i in ajValidate.errors) {
          var error = ajValidate.errors[i];
          errors.push({
            message: error.message,
            field: error.dataPath.substr(1)
          });
        }
        return errors;
      }
    }
  }]);

  return Betelgeuse;
}();

exports.default = Betelgeuse;
var Types = exports.Types = {
  integer: 'integer',
  number: 'number',
  boolean: 'boolean',
  string: 'string',
  array: 'array',
  object: 'object',
  arrayOf: function arrayOf(Type) {
    var schema = {
      type: 'array'
    };
    if (Type.prototype instanceof Betelgeuse) {
      schema.ref = Type;
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
    var schema = {};
    schema[attr] = Type.schema[attr];
    return schema;
  }
};

Betelgeuse.Types = Types;