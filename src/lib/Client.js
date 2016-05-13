"use strict";

const Query = require('./Query').Query;
const constants = require('./constants');

const JSONbig = require('json-bigint');
const rp = require('request-promise');
const _ = require('lodash');

const jsonSerializer = (bigint) => {
    return bigint ? JSONbig : JSON;
}

class Client {
    constructor(options) {
        this.options = {
            host : options.host || '127.0.0.1',
            port : options.port || '8983',
            core : options.core || '',
            path : options.path || '/solr',
            agent : options.agent,
            secure : options.secure || false,
            bigint : options.bigint || false
        }

        if (options.master) {
            this.options.master = {    
                host : options.master.host || options.host,
                port : options.master.port || options.port,
                core : options.master.core || options.core,
                path : options.master.path || options.path,
                agent : options.master.agent || options.agent
            }
        }
        else {
            this.options.master = {    
                host : options.host,
                port : options.port,
                core : options.core,
                path : options.path,
                agent : options.agent
            }
        }

        JSON = this.options.bigint ? JSONbig : JSON;
    }

    add(documents) {
        documents = documents instanceof Array ? documents : [documents];
        return this.update(documents);
    }

    delete(query, options) {
        query = new Query(query).toString();
        return this.update({
            delete: {
                query
            }
        }, options);
    }

    search(query) {
        query = new Query(query).query;
        return this.get(constants.HANDLERS.SELECT, query);
    }

    spell(query) {

    }

    ping() {
        return this.get(constants.HANDLERS.PING);
    }

    prepareCommit() {
        return this.update({},{ prepareCommit : true });
    }

    softCommit() {
        return this.update({},{ softCommit : true });
    }

    commit(options) {
        return this.update({
            commit: options || {}
        });
    }

    optimize(options) {
        return this.update({
            optimize: options || {}
        })
    }

    rollback() {
        return this.update({ rollback: {} });
    }

    update(data, options) {
        return this.post(constants.HANDLERS.UPDATE, data, options);
    }

    get(handler, query) {
        let options = {
            uri: `http://${this.options.host}:${this.options.port}${this.options.path}/${this.options.core}/${handler}`,            
            qs: _.merge({wt:'json'}, query)        
        }

        return rp(options).then(response => {
            return jsonSerializer(this.options.bigint).parse(response);
        });
    }

    post(handler, data, options) {
        data = jsonSerializer(this.options.bigint).stringify(data);
        options = {            
            method: 'POST',
            uri: `http://${this.options.master.host}:${this.options.master.port}${this.options.master.path}/${this.options.master.core}/${handler}`,
            qs: _.merge({wt:'json'}, options),
            body: data,
            headers: {
                'User-Agent': options.master.agent,
                'Content-Type': 'application/json'
            }
        }

        return rp(options);
    }
}

module.exports = Client;