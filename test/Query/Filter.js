'use strict';

const should = require('chai').should;
const Filter = require(process.cwd() + '/src/Lib/Query').Filter;

describe('Filter', function() {
  describe('By Value', function() {
    describe('Find document by id', function() {
      it('should find the document id:1', function() {
        let filter = new Filter({
          id: 1
        });

        filter.filterString.should.equal('id:1');
      });

      it('should find the document id:1,2,3,4', function() {
        let filter = new Filter({
          id    : [1, 2, 3, 4]
        });

        filter.filterString.should.equal('id:(1 2 3 4)');
      });

      it('should find the document id:10 and typeId:20', function() {
        let filter = new Filter({
          id    : 10,
          typeId: 20
        });

        filter.filterString.should.equal('id:10 AND typeId:20');
      });

      it('should find the document id:10,20,30,40 and typeId:20', function() {
        let filter = new Filter({
          id    : [10, 20, 30, 40],
          typeId: 20
        });

        filter.filterString.should.equal('id:(10 20 30 40) AND typeId:20');
      });
    });
  });

  describe('By Arrays', function() {
    describe('Find list of docs based on an array of ids', function() {
      it('should equal id:(1 2 3)', function() {
        let filter = new Filter({
          id: {
            or: [1, 2, 3]
          }
        });

        filter.filterString.should.equal('id:(1 2 3)');
      });

      it('should equal id:(1 OR 2 OR 3) with default solr operator as "AND"', function() {
        let filter = new Filter({
          id: {
            or: [1, 2, 3]
          }
        }, 'and', 'and');

        filter.filterString.should.equal('id:(1 OR 2 OR 3)');
      });

      it('should equal id:(1 AND 2 AND 3)', function() {
        let filter = new Filter({
          id: {
            and: [1, 2, 3]
          }
        });

        filter.filterString.should.equal('id:(1 AND 2 AND 3)');
      });

      it('should equal id:(1 2 3) with default solr operator as "AND"', function() {
        let filter = new Filter({
          id: {
            and: [1, 2, 3]
          }
        }, 'and', 'and');

        filter.filterString.should.equal('id:(1 2 3)');
      });
    });

    describe('Find list of docs based on matching all tags', function() {
      it('should equal tags:(sports AND nba)', function() {
        let filter = new Filter({
          tags: {
            and: ['sports', 'nba']
          }
        });

        filter.filterString.should.equal('tags:("sports" AND "nba")');
      });

      it('should equal tags:("sports" "nba")', function() {
        let filter = new Filter({
          tags: {
            or: ['sports', 'nba']
          }
        });

        filter.filterString.should.equal('tags:("sports" "nba")');
      });

      it('should equal tags:(sports nba) without explicit OR', function() {
        let filter = new Filter({
          tags: ['sports', 'nba']
        });

        filter.filterString.should.equal('tags:("sports" "nba")');
      });
    });
  });

  describe('By Multiple Types', function() {
    describe('with more complicated query', function() {
        it('should find type with urgency(>=1 and lt:2) and tags(nba sports) not referencing tag:(nfl or nhl)', function() {
        var filter = new Filter({
          and: {
            type   : 1,
            tags   : {
              and: ['sports', 'nba']
            },
            '-tags': {
              or: ['nfl', 'nhl']
            },
            urgency: {
              to: {
                gte: 1,
                lt : 2
              }
            }
          }
        });

        filter.filterString.should.equal('type:1 AND tags:("sports" AND "nba") AND -tags:("nfl" "nhl") AND urgency:[1 TO 2}');
      });

      it('should pull a lot of different types of content each content with different with an AND', function() {
        var filter = new Filter({
          and: [
            {
              type  : [1],
              typeId: [2]
            }
          ]
        });

        filter.filterString.should.equal('(type:1 AND typeId:2)');
      });

      it('should pull a lot of different types of content each content with different urgencies and tags', function() {
        var filter = new Filter({
          or: [
            {
              module_type_id: [1],
              tags          : {
                and: ['sports', 'thunder']
              },
              '-tags'       : {
                or: ['recap', 'daily']
              },
              urgency_i     : {
                to: {
                  gte: 1,
                  lt : 3
                }
              }
            },
            {
              module_type_id: [51],
              tags          : {
                and: ['nba', 'video', 'live']
              },
              '-tags'       : {},
              urgency_i     : {
                to: {
                  gte: 1,
                  lte: 3
                }
              }
            },
            {
              module_type_id: [61],
              tags          : {
                and: ['nba', 'audio', 'live']
              },
              '-tags'       : {},
              urgency_i     : {
                to: {
                  gte: 1,
                  lte: 4
                }
              }
            },
            {
              module_type_id: [4],
              tags          : {
                and: ['sports', 'nba', 'tweets']
              },
              '-tags'       : {}
            }
          ]
        });

        filter.filterString.should.equal('((module_type_id:1 AND tags:("sports" AND "thunder") AND -tags:("recap" "daily") AND urgency_i:[1 TO 3}) (module_type_id:51 AND tags:("nba" AND "video" AND "live") AND urgency_i:[1 TO 3]) (module_type_id:61 AND tags:("nba" AND "audio" AND "live") AND urgency_i:[1 TO 4]) (module_type_id:4 AND tags:("sports" AND "nba" AND "tweets")))');
      });
    });
  });
});