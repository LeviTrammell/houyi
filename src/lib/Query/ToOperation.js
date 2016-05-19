"use strict";

class ToOperation {
    constructor(operation) {
        this.value = operation.value;
    }
    
    inspect() {
       return this.toString(); 
    }

    toString() {
        let start = '[*';
        let end   = '*]';
        if (this.value) {
            if (this.value.gte) {
                start = '[' + this.value.gte;
            } else if (this.value.gt) {
                start = '{' + this.value.gt;
            }

            if (this.value.lte) {
                end = this.value.lte + ']';
            } else if (this.value.lt) {
                end = this.value.lt + '}';
            }
        }

        return start + ' TO ' + end;
    }
}

module.exports = ToOperation;
