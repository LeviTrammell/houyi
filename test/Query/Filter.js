const should = require('chai').should;
const Filter = require('../../src/lib/Query').Filter;

describe('Filter', function() {
    describe('Array of ids', function() {
        var filter = new Filter({
            id: {
                or:[1, 2, 3]
            }
        });
        
        it('should equal id:(1 OR 2 OR 3)', function() {            
            filter.filterString.should.equal('id:(1 OR 2 OR 3)');
        });        
    });

    describe('Nested and/or queries', function() {
        var filter = new Filter({
            and: {
                type:1,
                or: [
                    {
                        id: 34 
                    },
                    {
                        type:25
                    }
                ]
            }
        });
        
        console.log(filter.filterString);
        // it('should equal id:(1 OR 2 OR 3)', function() {            
        //     filter.filterString.should.equal('id:(1 OR 2 OR 3)');
        // });        
    });

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
            filter.filterString.should.equal('(type:1 AND tags:(hello AND world) AND -tags:(foo OR bar) AND number:[100 TO 200] AND date:([1 TO 2] OR [4 TO 5]))');      
        });
    });
});