import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Betelgeuse, { Types } from '../src/Betelgeuse'
import Towel from './classes/Towel';
import Hitchhiker from './classes/Hitchhiker';

chai.use(chaiAsPromised);

describe('Betelgeuse', () => {

  beforeEach(() => {

  });

  describe('Classes', () => {

    it('Should bind all schema fileds passed by constructor', () => {
      let data = {id:6, color:'red', weight: 0.56};
      let towel = new Towel(data);
      expect(towel.id).to.be.equal(data.id);
      expect(towel.color).to.be.equal(data.color);
      expect(towel.weight).to.be.equal(data.weight);
    });
    it('Should ignore non schema filed', () => {
      let data = {id:6, color:'red', weight: 0.56, foo: 'whatever'};
      let towel = new Towel(data);
      expect(towel.foo).to.be.undefined;
    });
    it('Should add children instance',  () => {
      let towel = {id:6, color:'ed', weight: 0.56};
      let data = {id: 1, name: 'Arthur Dent', towel: towel};
      let hitchhiker = new Hitchhiker(data);
      expect(hitchhiker.towel).to.be.an.instanceOf(Towel);
    });
  });

  describe('Validations', () => {

  });

  describe('Functions', () => {
    it('Should transforme attribute to presenter model');
    it('Should create model instance from presenter model');

  });
});
