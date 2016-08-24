import Betelgeuse, { Types } from 'Betelgeuse';

export default class Towel extends Betelgeuse {
  static schema = {
    id: Types.integer,
    color: {
      type: Types.string,
      minLength: 3
    }
  }
}
