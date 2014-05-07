require('blanket');
var should = require('should');
var srtValidator = require('validator');
var validateIt = require('./../src/validate-it.js');

var rules = [
  {
    name: 'username',
    required: true,
    len: [3, 20],
    msg: {
      required: 'Ohooho user name required'
    }
  },
  {
    name: 'password',
    required: true,
    len: [3, 20]
  },
  {
    name: 'email',
    required: false,
    custom: {
      isEmail: function(val) {
        return srtValidator.isEmail(val);
      }
    },
    msg: {
      isEmail: 'Bad email'
    }

  }
];

var validData = [
  {username: 'vladko', password: 'qqq'},
  {username: 'pashko', password: 'zxc', email: 'pashko@mail.com'}
];

describe('when data is valid', function () {
  it('should not find errors', function () {
    validData.forEach(function (key) {
      (validateIt(key, rules)).should.be.empty;
    });
  });

});

describe('when data is invalid', function () {
  it('should find errors', function () {
    (validateIt({x: 'qwe'}, [{name: 'x', len: 10}])).should.eql({ x:'Expected min 10 symbols Given: 3' });
  });

  describe('when "empty" function used', function () {

    it('should return default short message', function() {
      (validateIt({x:''}, [{name: 'x', empty:false}])).should.eql({ x:'Is empty'});
    });

    it('should return default message', function() {
      var toCheck = {x:''},
          rules = [{name: 'x', empty:false}],
          opts = {short: false};
      var result = validateIt(toCheck, rules, opts);
      result.should.eql({ x: {empty: 'Is empty'}});
    });
  });
});


