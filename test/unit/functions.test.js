import expect from 'expect.js';
import Hitchhiker from '../classes/Hitchhiker';


describe('Betelgeuse - Functions', function () {
  beforeEach(function () {
    this.towelData = {
      id: 6,
      color: 'red',
    };

    this.guideData = {
      id: 6,
      model: 'GPP',
    };

    this.hitchhikerData = {
      id: 42,
      name: 'Arthur Dent',
      tags: [
        'human',
      ],
      towels: [
        this.towelData,
      ],
      guide: this.guideData,
    };
    this.hitchhiker = new Hitchhiker(this.hitchhikerData);
  });

  describe('validate', function () {
    it('should be a function', function () {
      expect(this.hitchhiker.validate).to.be.a('function');
    });
  });

  describe('fetch', function () {
    it('should be a function', function () {
      expect(this.hitchhiker.fetch).to.be.a('function');
    });
  });
});
