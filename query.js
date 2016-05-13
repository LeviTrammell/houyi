"use strict";

let filters = query => {    
    let build = (query, filters) => {        
        let fq = Object.keys(query).map(property => {
            console.log(matchFilter);
            console.log(rangeFilter);
            switch (property) {
                case 'range': 
                    return rangeFilter(query[property]);                    
                case 'match': 
                    return matchFilter(query[property]);                    
                default:
                    console.log(`${property} is not a valid query property.`);
                    break;
            }
        });

        return (fq.length > 1) ? fq.join(' AND ') : fq[0];
    }
    if (query instanceof Array) {
        query = '(' + query.map(query => build(query)).join(' OR ') + ')';
    } else {
        query = build(query);
    }
    return `fq=${query}`
}

let matchFilter = matchFilter => {
    let build = filter => {
        if (filter.value instanceof Array) {
            filter.value = '(' + filter.value.join(' OR ') + ')';
        }
        return `${filter.field}:${filter.value}`;
    }
    if (matchFilter instanceof Array) {
        matchFilter = '(' + matchFilter.map(filter => build(filter)).join(' AND ') + ')';        
    } else {
        matchFilter = build(matchFilter);
    }
    return matchFilter;
}

let rangeFilter = rangeFilter => {
    let build = filter => {
        let start = (filter.start !== undefined ? filter.start : '*');
        let end = (filter.end !== undefined ? filter.end : '*');
        return `${filter.field}:[${start} TO ${end}]`;     
    }
    if (rangeFilter instanceof Array) {
        rangeFilter = '(' + rangeFilter.map(filter => build(filter)).join(' AND ') + ')';        
    } else {
        rangeFilter = build(rangeFilter);
    }
    return rangeFilter;
}

let dateISOify = object => {
    if (object instanceof Array){
        object = object.map(date => {
            return dateISOify(date);
        });
    }
    else if (object instanceof Date) {
        object = toISOString(object);
    }

    return obj;
};

let toISOString = date => {
    return (date && !isNaN(date.getTime())) ? date.toISOString() : null;
};

console.log(filters(
    [
        {
            match:{
                field: 'name',
                value: 'Levi'
            },
            range:[
                {
                    field: 'date',
                    start: new Date(),
                    end: new Date()
                },
                {
                    field: 'otherNumber',
                    end: 300            
                }
            ]
        },
        {
            range:[
                {
                    field: 'number',
                    start: 0
                }
            ]
        }
    ]
));