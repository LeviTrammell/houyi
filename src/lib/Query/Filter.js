"use strict";

const Field = require('./Field');
const BooleanOperation = require('./BooleanOperation');

const _ = require('lodash');

const rangeFilter = (start, end) => {
    start = start | '*';
    end = end | '*';
    return `[${start} TO ${end}]`;
}

class Filter {
    constructor(filter) {
        this.filter = this.parse(filter);
        this.filterString = this.build(this.filter);
    }

    parse(filter) {
        return _.map(filter, (value, key) => {
            let filter = {};

            if (value instanceof Object 
                && !(value instanceof Array) 
                && !value.start
                && !value.end) value = this.parse(value);
            if ((key === 'or' || key === 'and') 
                && value instanceof Array 
                && typeof value[0] === 'object') value = _.map(value, value => this.parse(value));
                            
            switch (key) {
                case 'or':
                    return new BooleanOperation({
                        operator: ' OR ',
                        value
                    });
                    break;
                case 'and':
                    return new BooleanOperation({
                        operator: ' AND ',
                        value
                    })                    
                    break;
                default:
                    return new Field({
                        name: key,
                        value
                    });
                    break;
            }

            return filter;
        });
    }

    buildOne(filter) {
        let filterString = '';
        if (filter instanceof Field) {
            filterString = `${filter.name}:`;
            if (filter.value instanceof Object) {
                if (!filter.value.start && !filter.value.end) filterString += this.build(filter.value);
                else filterString += rangeFilter(filter.value.start, filter.value.end);                                        
            }
            else filterString += filter.value;
        } else if (filter instanceof BooleanOperation) {
            filterString = '(' + filter.value.map(filters => this.build(filters)).join(filter.operator) + ')';
        } else if (filter.start || filter.end) filterString += rangeFilter(filter.start, filter.end);
        else filterString = filter;  
        
        return filterString;
    }

    build(filter) {
        let filterString = '';
        if (filter instanceof Array) {
            _.forEach(filter, filter => {
                filterString += this.buildOne(filter);
            });
        } else filterString = this.buildOne(filter);        
        
        return filterString;
    }

    toString() {
        return this.filterString;
    }
}

module.exports = Filter;

let j = new Filter({
    module_type_id: {
        or:[1, 2, 3]
    }
});
console.log(j.filter[0].value);
console.log(j.filterString);