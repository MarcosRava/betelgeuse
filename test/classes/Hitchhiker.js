import Betelgeuse, { Types } from 'src/Betelgeuse';
import Towel from 'test/classes/Towel';

export default class Hitchhiker extends Betelgeuse {
  static schema = {
    id: Types.integer,
    name: {
      type: Types.string,
      minLength: 3
    },
    tags: Types.arrayOf(Types.string),
    towels: Types.arrayOf(Towel)
  }
}
