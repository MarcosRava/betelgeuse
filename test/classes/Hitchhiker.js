import Betelgeuse, { Types } from 'src/Betelgeuse';
import Towel from 'test/classes/Towel';

export default class Hitchhiker extends Betelgeuse {
  //start-non-standard
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
  //end-non-standard
}
