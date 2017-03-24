'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Types = function Types(Betelgeuse) {
  _classCallCheck(this, Types);

  this.integer = 'integer';
  this.number = 'number';
  this.boolean = 'boolean';
  this.string = 'string';
  this.array = 'array';
  this.object = 'object';

  this.arrayOf = function arrayOf(Type, options) {

    var schema = (0, _extend2.default)(true, options, { type: 'array' });

    if (Type.prototype instanceof Betelgeuse) {
      schema.ref = Type;
    } else if (typeof Type === 'function') {
      schema.items = Type.name ? Type.name.toLowerCase() : Type.toString();
    } else if (typeof Type === 'string') {
      schema.items = Type;
    }

    return schema;
  };

  this.attributeOf = function attributeOf(Type, attr) {

    if (!Type.prototype instanceof Betelgeuse) {
      throw new Error('Must be an instance of Betelguese');
    }

    var schema = {};

    schema[attr] = Type.schema[attr];

    return schema;
  };

  this.enumValues = function () {
    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    return {
      enum: values
    };
  };
};

exports.default = Types;