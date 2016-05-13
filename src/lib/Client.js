"use strict";

const Query = require('./Query').Query;

const constants = require('./constants');
const rp = require('request-promise')

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
    }

    search(query) {
        query = new Query(query).query;
        options = {
            uri: `${this.options.host}:${this.options.port}/${this.options.path}/${this.options.core}/${constants.HANDLERS.SELECT}`,
            qs: query
        }
        console.log(options);
    }
}

let client = new Client({});
client.search({
    fl:['type', 'tags', 'date'],
    fq:{
        and:{
            type: 1,
            tags: {
                and: ['hello', 'world']
            },
            '-tags': {
                or: ['foo', 'bar']
            },
            number: {
                start: 100,
                end: 200
            }, 
            date: {
                or: [
                    {
                        start: "1",
                        end: "2"
                    },
                    {
                        start: "4",
                        end: "5"
                    }
                ]
            }
        }
    }
})