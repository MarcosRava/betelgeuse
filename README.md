# ![Betelgeuse](https://github.com/MarcosRava/misc/raw/master/imgs/logos/betelgeuse.jpg)

## Betelgeuse is a model structure based on JSON schema and [Ajv](https://github.com/epoberezkin/ajv) validations

![work: in progress](https://img.shields.io/badge/work-in%20progress-orange.svg)

### Proposal:

* Model structure to client and server sides
* Model Validations based on schema

### Install

```
npm install betelgeuse

```

### Usage

```js

import Betelgeuse, { Types } from 'betelgeuse';

class Towel extends Betelgeuse {
  static schema = {
    id: Types.integer,
    color: {
      type: Types.string,
      minLength: 3
    }
  }
}

let towel = new Towel({id:6, color:'red'});

const errors = towel.validate();
console.error(errors);
// undefined
const fields = towel.fetch();
console.log(fields);
// {id:6, color:'red'}
```

with errors

```js
let towel2 = new Towel({id:6, color:'ed'});
const errors = towel2.validate();
//[ { message: 'should NOT be shorter than 3 characters', field: 'color' } ]


```
