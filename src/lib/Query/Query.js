"use strict";

const Filter = require('./').Filter;
const _ = require('lodash');

class Query {
    constructor(query) {        
        this.query = this.build(query);
    }

    build(query) {
        _.forEach(query, (value, key) => {
            switch (key) {
                case 'q':
                case 'fq':
                    query[key] = new Filter(value).toString();
                    break;
                case 'fl':                
                    if (value instanceof Array) query[key] = value.join(',');
                    break;                
            }
        });
        
        return query;
    }
}

module.exports = Query;