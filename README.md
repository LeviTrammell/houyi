# houyi

#### End Goal
The end goal is to be able to do complex queries such as this :
```
query: [{
    matchFilter: {
        type: 1,
        tags: ['hello', 'world'],
        '-tags': ['foo', 'bar']
    },
    rangeFilter:{
        number: {
            start: 100,
            end: 200
        }, 
        sort_date: {
            start: startDate,
            end: endDate
        }
    }
},
{
    matchFilter: {
        type: 2,
        tags: ['foo', 'bar'],
        '-tags': ['hello', 'world']
    },
    rangeFilter:{
        number: {
            start: 300            
        }, 
        sort_date: {            
            end: endDate
        }
    }
}];
```
