import Betelgeuse, { Types } from '../../src/Betelgeuse';

export default class Towel extends Betelgeuse {}

Towel.schema = {
  id: Types.integer,
  color: {
    type: Types.string,
    minLength: 3,
  },
};
