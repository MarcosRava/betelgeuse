import Betelgeuse, { Types } from 'Betelgeuse';

export default class Guide extends Betelgeuse {
  static schema = {
    id: Types.integer,
    model: {
      type: Types.string,
      minLength: 3
    }
  }
}