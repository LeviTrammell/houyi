'use strict';

const FieldOperation   = require('./FieldOperation');
const BooleanOperation = require('./BooleanOperation');
const ToOperation      = require('./ToOperation');

const AND = ' AND ';
const OR  = ' OR ';

/**
 * Verified passed operator is allowed.
 *
 * @param operator
 * @returns {*}
 */
function checkOperator(operator) {
  const checkOperator = operator.trim().toUpperCase();
  switch (checkOperator) {
    case 'AND':
      operator = AND;
      break;
    case 'OR':
      operator = OR;
      break;
    default:
      throw new Error('Operator (' + operator + ') unknown')
  }

  return operator;
}

/**
 * Filter class
 */
class Filter {
  /**
   *
   * @param filter
   * @param defaultObjectOperator - Default operator used for objects, when operator is not specified.
   * @param defaultSolrOperator - Solr default Operator, 'OR'
   */
  constructor(filter, defaultObjectOperator, defaultSolrOperator) {
    defaultObjectOperator = defaultObjectOperator || AND;
    defaultSolrOperator   = defaultSolrOperator || OR;

    this.defaultObjectOperator = checkOperator(defaultObjectOperator);
    this.defaultSolrOperator   = checkOperator(defaultSolrOperator);

    this.filter       = this.parse(filter, this.defaultObjectOperator);
    this.filterString = this.build(this.filter);
  }

  /**
   *
   * @param content
   * @param delim
   * @returns {*}
   */
  parseArray(content, delim) {
    let results = null;
    let vals    = [];
    for (let i in content) {
      let value = content[i];
      if (value instanceof Object) {
        value = '(' + this.parseObject(value, delim) + ')';
      } else if (isNaN(value)) {
        value = '"' + value + '"';
      }

      vals.push(value);
    }

    if (vals.length > 1) {
      if (delim === this.defaultSolrOperator) {
        results = '(' + vals.join(' ') + ')';
      } else {
        results = '(' + vals.join(delim) + ')';
      }
    } else {
      results = vals.join();
    }
    
    return results;
  }

  /**
   *
   * @param content
   * @returns {Array}
   */
  parseObject(content, operator) {
    const filters = [];
    const o       = {
      id    : [1, 2, 3, 4],
      typeId: [1, 2, 3, 4]
    };

    for (let name in content) {
      let value     = content[name];
      let operation = null;

      /** Check if value is an object **/
      switch (name) {
        case 'to':
          operation = new ToOperation({value});
          break;

        case 'or':
          value = this.parse(value, OR, name);

          if (value instanceof Object) {
            operation = new BooleanOperation({name, operator: AND, value: value});
          } else {
            operation = new FieldOperation({value});
          }
          break;

        case 'and':
          value = this.parse(value, AND, name);

          if (value instanceof Object) {
            operation = new BooleanOperation({name, operator: AND, value: value});
          } else {
            operation = new FieldOperation({value});
          }
          break;

        default:
          if (value instanceof Object) {
            if (value instanceof Array) {
              value = this.parseArray(value, this.defaultSolrOperator);
            } else {
              value = this.parseObject(value, this.defaultObjectOperator);
            }

            if (value.length) {
              operation = new FieldOperation({name, value: value});
            }

          } else if (isNaN(name)) {
            if (!isNaN(value) || (isNaN(value) && value.length)) {
              operation = new FieldOperation({name, value});
            }

          } else {
            operation = value;
          }

          break;
      }

      if (operation) {
        filters.push(operation);
      }
    }

    return filters.join(AND);
  }

  /**
   *
   * @param content
   * @param delim
   * @returns {*}
   */
  parse(content, delim) {
    this.parseDepth = this.parseDepth || 0;
    this.parseDepth++;

    let results = content;
    if (content instanceof Object) {
      if (content instanceof Array) {
        results = this.parseArray(content, delim);

      } else {
        results = this.parseObject(content, delim);
      }
    }

    this.parseDepth--;
    return results;
  }

  /**
   *
   * @param filters
   * @returns {string}
   */
  build(filters) {
    if (!(filters instanceof Array)) {
      filters = [filters];
    }

    const filterStrings = filters.map(filter => {
      return filter.toString();
    });

    return filterStrings.join(AND);
  }

  toString() {
    return this.filterString;
  }
}

module.exports = Filter;
