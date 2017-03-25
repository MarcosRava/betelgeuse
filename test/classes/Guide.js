import Betelgeuse, { Types } from '../../src/Betelgeuse';

export default class Guide extends Betelgeuse { }

Guide.schema = {
  id: Types.integer,
  model: {
    type: Types.string,
    minLength: 3,
  },
};
