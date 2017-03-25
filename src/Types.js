import extend from 'extend';

export default class Types {
  constructor(Betelgeuse) {
    this.integer = 'integer';
    this.number = 'number';
    this.boolean = 'boolean';
    this.string = 'string';
    this.array = 'array';
    this.object = 'object';

    this.Betelgeuse = Betelgeuse;
    this.enumValues = function enumValues(...values) {
      return {
        enum: values,
      };
    };
  }

  arrayOf(Type, options) {
    const schema = extend(true, options, { type: 'array' });

    if (Type.prototype instanceof this.Betelgeuse) {
      schema.ref = Type;
    } else if (typeof Type === 'function') {
      schema.items = Type.name ? Type.name.toLowerCase() : Type.toString();
    } else if (typeof Type === 'string') {
      schema.items = Type;
    }

    return schema;
  }

  attributeOf(Type, attr) {
    if (!(Type.prototype instanceof this.Betelgeuse)) {
      throw new Error('Must be an instance of Betelguese');
    }

    const schema = {};

    schema[attr] = Type.schema[attr];

    return schema;
  }
}
