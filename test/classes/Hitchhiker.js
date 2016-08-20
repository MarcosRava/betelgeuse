import Betelgeuse, { Types } from '../../src/Betelgeuse';
import Towel from './Towel';

export default class Hitchhiker extends Betelgeuse {
  static schema = {
    id: Types.integer,
    name: {
      type: Types.string,
      minLength: 3
    },
    towel: {
      ref: Towel
    }

  }
}
