var assert = require('assert');
var should = require('chai').should();
var isAString = require('../main.js');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
/*
describe('isAString', function(){
  it('should return false when the value is not a string, function() {
    assert.
  });
 
});
*/
