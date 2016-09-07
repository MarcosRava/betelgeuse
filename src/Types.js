import extend from 'extend';

export default class Types {
  constructor(Betelgeuse) {

    this.integer = 'integer';
    this.number = 'number';
    this.boolean = 'boolean';
    this.string = 'string';
    this.array = 'array';
    this.object = 'object';

    this.arrayOf = function arrayOf(Type, options) {

      let schema = extend(true, options, { type: 'array' });

      if (Type.prototype instanceof Betelgeuse) {
        schema.ref= Type;
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

      let schema = {};

      schema[attr] = Type.schema[attr];

      return schema;
    };

    this.enumValues = function (...values) {
      return {
        enum: values
      };
    }

  }
}
