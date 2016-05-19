"use strict";

class Field {
  constructor(field) {
    this.name     = field.name;
    this.operator = field.operator;
    this.value    = field.value;
  }

  inspect() {
    return this.toString();
  }

  toString() {
    if (!this.name || !isNaN(this.name)) {
      return this.value;
    }
    return this.name + ':' + this.value;
  }
}
module.exports = Field;