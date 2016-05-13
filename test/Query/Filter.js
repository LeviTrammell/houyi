const should = require('chai').should;
const Filter = require('../../').Query.Filter;

describe('Filter', function() {
  describe('Let\'s go crazy!', function() {
    var filter = new Filter({
        and:{
            type: 1,
            tags: {
                and: ['hello', 'world']
            },
            '-tags': {
                or: ['foo', 'bar']
            },
            number: {
                start: 100,
                end: 200
            }, 
            date: {
                or: [
                    {
                        start: "1",
                        end: "2"
                    },
                    {
                        start: "4",
                        end: "5"
                    }
                ]
            }
        }
    });

    it('should equal (type:1 AND tags:(hello AND world) AND -tags:(foo OR bar) AND number:[100 TO 200] AND date:([1 TO 2] OR [4 TO 5]))', function() {
        
        filter.toString().should.equal('(type:1 AND tags:(hello AND world) AND -tags:(foo OR bar) AND number:[100 TO 200] AND date:([1 TO 2] OR [4 TO 5]))');      
    });
  });
});