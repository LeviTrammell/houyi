# houyi - Promise based solr node.js client

[![Build Status](https://travis-ci.org/LeviTrammell/houyi.svg?branch=master)](https://travis-ci.org/LeviTrammell/houyi)

### About

Houyi is a Solr Client built for the modern-day node. It's driven by promises, and a query language similar to that seen on the official elasticsearch node client.

### Installation instructions

```console
npm install --save houyi
```

### Usage

```js
var houyi = require('houyi');

var client = new houyi({
    host: '127.0.0.1' 
    port: '8983',
    core : 'testcore'    
});

client.search({
    fq: {
        and:{
            type: 1,
            tags: {
                and: ['hello', 'world']
            },
            '-tags': {                  // use the minus to exclude/not a specified variable
                or: ['foo', 'bar']
            },
            number: {
                start: 100,             // create ranged queries like so.
                end: 200
            }, 
            otherNumber: {
                or: [
                    {
                        start: 1,
                        end: 2
                    },
                    {
                        start: 4        // A ranged query only needs a start or an end. Whichever doesn't exist will have a * appended.
                    }
                ]
            }
        }
    }
}).then(function(sr) {
    console.log(sr.response);
}).catch(function(err) {
    console.log(err); // Catch any errors houyi produces.
});
```

###Add/Update Documents
```js
client.add({
    id: 'myrandom.id',
    title: 'the title I chose'
});
```

###Delete Documents
```js
client.delete({
    id: 'myrandom.id'
});
```

###Commit
```js
client.commit();
```

###Ping Solr
Check to ensure that you can connect to your solr box :
```js
client.ping().then(function(response) {
    console.log(response) 
});
```

###Chaining Queries
```js
client.add({
    id:'test',
    title: 'just testing this out'
}).then(response => {
    return client.commit()
}).then(response => {
    return client.search({
        fq: {
            id: 'test'
        }
    })
}).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});
```

###Master/Slave Support
Your setup might not be completely up-to-date with the latest and greatest Solr Cloud. This is not a problem. You may wish to only write to master, and that can be done by using the "master" option with the houyi client parameters

```js
var client = new houyi({
    host: '127.0.0.1' 
    port: '8983',
    core: 'testcore',
    bigint: true
    master: {
        host: '192.168.0.1'
    }
});
```

###Big Int Support

Parse big integers by setting bigint to true within the houyi client parameters. This is set to false by default.

```js
var client = new houyi({
    host: '127.0.0.1' 
    port: '8983',
    core: 'testcore',
    bigint: true
});
```
