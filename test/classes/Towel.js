import Betelgeuse, { Types } from 'src/Betelgeuse';

export default class Towel extends Betelgeuse {
  //start-non-standard
  static schema = {
    id: Types.integer,
    color: {
      type: Types.string,
      minLength: 3
    },
    weight: Types.number
  }

  static presenter = {
    properties: {
      weight: "w"
    },
    exclude: ['id']
  }
  //end-non-standard
}
