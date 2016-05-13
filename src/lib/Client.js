"use strict";

const Query = require('./Query').Query;
const constants = require('./constants');

const JSONbig = require('json-bigint');
const rp = require('request-promise');
const _ = require('lodash');

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

    softCommit(){
        return this.update({},{ softCommit : true });
    }

    commit(options) {
        return this.update({
            commit: options || {}
        });
    }

    search(query) {
        query = new Query(query).query;        
        return this.get(constants.HANDLERS.SELECT, query);
    }
    
    update(data, options) {
        return this.post(constants.HANDLERS.UPDATE, data, options);
    }

    get(handler, query) {
        let options = {
            uri: `http://${this.options.host}:${this.options.port}${this.options.path}/${this.options.core}/${handler}`,            
            qs: _.merge({wt:'json'}, query),
            json: true
        }

        return rp(options);
    }

    post(handler, data, options) {
        options = {
            method: 'POST',
            uri: `http://${this.options.master.host}:${this.options.master.port}${this.options.master.path}/${this.options.master.core}/${handler}`,
            qs: _.merge({wt:'json'}, options),
            body: data,
            json: true
        }

        return rp(options);
    }
}

let client = new Client({
    core:'muggy',
    bigint:true
});
// client.search({
//     fl: ['title', 'id'],
//     fq: {
//         'id': {
//             or: [
//                 'testid',
//                 'otherid'
//             ]
//         }
//     }
// }).then(response => {
//     console.log(response.response.docs);
// });
client.add({
    id:'latertest',
    title: 'jsdf this one out'
}).then(response => {
    return client.commit()    
}).then(response => {
    return client.search({
        fq: {
            id: 'latertest'
        }
    })
}).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
})
