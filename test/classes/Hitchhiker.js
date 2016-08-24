import Betelgeuse, { Types } from 'Betelgeuse';
import Towel from './Towel';
import Guide from './Guide';

export default class Hitchhiker extends Betelgeuse {
  static schema = {
    id: Types.integer,
    name: {
      type: Types.string,
      minLength: 3
    },
    tags: Types.arrayOf(Types.string),
    guide: {
      ref: Guide
    },
    towels: Types.arrayOf(Towel)
  }
}
