'use strict';

import expect from 'expect.js';
import Towel from '../test/classes/Towel';
import Guide from '../test/classes/Guide';
import Hitchhiker from '../test/classes/Hitchhiker';


describe('Betelgeuse - Instance', function () {

  beforeEach(function () {
    this.towelData = {
      id:6,
      color:'red'
    };

    this.guideData = {
      id:6,
      model:'GPP'
    };
  });

  it('Should bind all schema fileds passed by constructor', function () {
    const towel = new Towel(this.towelData);
    expect(towel.id).to.eql(this.towelData.id);
    expect(towel.color).to.eql(this.towelData.color);
  });

  it('Should ignore non schema filed', function () {
    this.towelData.foo = 'foo';
    const towel = new Towel(this.towelData);
    expect(towel.foo).to.be(undefined);
  });

  it('Should add child instance',  function () {
    const data = {
      id: 1,
      name: 'Arthur Dent',
      guide: this.guideData
    };
    const hitchhiker = new Hitchhiker(data);
    expect(hitchhiker.guide).to.be.a(Guide);
  });

  it('Should add children (array) instance',  function () {
    const data = {
      id: 42,
      name: 'Arthur Dent',
      towels: [
        this.towelData
      ]
    };
    const hitchhiker = new Hitchhiker(data);
    expect(hitchhiker.towels[0]).to.be.a(Towel);
  });

  it('Should add a simple array of strings',  function () {
    const data = {
      id: 1,
      name: 'Arthur Dent',
      tags: [
        'earth',
        'human'
      ]
    };
    const hitchhiker = new Hitchhiker(data);
    expect(hitchhiker.tags[0]).to.be.a('string');
    expect(hitchhiker.tags[1]).to.be.a('string');
  });
});
