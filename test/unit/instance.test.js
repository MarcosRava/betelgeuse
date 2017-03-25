import expect from 'expect.js';
import Towel from '../classes/Towel';
import Guide from '../classes/Guide';
import Hitchhiker from '../classes/Hitchhiker';


describe('Betelgeuse - Instance', function () {
  beforeEach(function () {
    this.towelData = {
      id: 6,
      color: 'red',
    };

    this.guideData = {
      id: 6,
      model: 'GPP',
    };
  });

  it('Should bind all schema fileds passed by constructor', function () {
    const towel = new Towel(this.towelData);
    expect(towel.id).to.eql(this.towelData.id);
    expect(towel.color).to.eql(this.towelData.color);
    return towel.validate();
  });

  it('Should ignore non schema filed', function () {
    this.towelData.foo = 'foo';
    const towel = new Towel(this.towelData);
    expect(towel.foo).to.be(undefined);
    return towel.validate();
  });

  it('Should add child instance', function () {
    const data = {
      id: 1,
      name: 'Arthur Dent',
      guide: this.guideData,
    };
    const hitchhiker = new Hitchhiker(data);
    expect(hitchhiker.guide).to.be.a(Guide);

    return hitchhiker.validate();
  });

  it('Should add children (array) instance', function () {
    const data = {
      id: 42,
      name: 'Arthur Dent',
      towels: [
        this.towelData,
      ],
    };
    const hitchhiker = new Hitchhiker(data);
    expect(hitchhiker.towels[0]).to.be.a(Towel);
    return hitchhiker.validate();
  });

  it('Should add a simple array of strings', function () {
    const data = {
      id: 1,
      name: 'Arthur Dent',
      tags: [
        'earth',
        'human',
      ],
    };
    const hitchhiker = new Hitchhiker(data);
    expect(hitchhiker.tags[0]).to.be.a('string');
    expect(hitchhiker.tags[1]).to.be.a('string');
    return hitchhiker.validate();
  });

  it('Should add a enum field', function () {
    const data = {
      id: 1,
      name: 'Arthur Dent',
      tags: [
        'earth',
        'human',
      ],
      hairStyle: 'short',
    };

    const hitchhiker = new Hitchhiker(data);
    expect(hitchhiker.hairStyle).to.eql('short');
    return hitchhiker.validate();
  });

  it('Should validate a enum field', function () {
    const data = {
      id: 1,
      name: 'Arthur Dent',
      tags: [
        'earth',
        'human',
      ],
      hairStyle: 'baldless',
    };
    const hitchhiker = new Hitchhiker(data);
    return hitchhiker.validate()
      .catch(errors => expect(errors[0].field).to.eql('hairStyle'));
  });
});
