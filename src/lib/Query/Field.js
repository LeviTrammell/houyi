"use strict";

/*
Examples

name: 'levi trammell'

tags: {
    and: ['hello', 'world']
}

tags: {
    or: ['hello', 'world']
}

number: {
    start: 100,
    end: 200
}

number: {
    start: 100    
}

number: {
    end: 100
}
*/

class Field {
    constructor(field) {
        this.name = field.name;
        this.value = field.value;
    }
}
module.exports = Field;