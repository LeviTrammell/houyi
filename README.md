# houyi

#### End Goal
The end goal is to be able to do complex queries such as this :
```
filter: [{
    match: [
        {
        	field: 'type',
        	value: 1
        },
        {
        	field: 'tags',        	
        	value: ['hello', 'world']
        },
        {
        	field: '-tags',
        	value: ['foo', 'bar']
    	}
    ],
    range:[
        {
        	field: 'number',
            start: 100,
            end: 200
        }, 
        {
        	field; 'date',
            start: startDate,
            end: endDate
        }
    ]
},
{
    match: [
        {
        	field: 'type',
        	value: 2
        },
        {
        	field: 'tags',        	
        	value: 'bar'
        },
        {
        	field: '-tags',
        	value: ['hello', 'world']
    	}
    ],
    range:[
        {
        	field: 'number',            
            end: 200
        }, 
        {
        	field; 'date',
            start: startDate            
        }
    ]
}];
```