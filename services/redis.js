var stack = require('stack.io');
var redis = require('redis'),
    rClt = redis.createClient(process.env['DOTCLOUD_STORE_REDIS_PORT'],
        process.env['DOTCLOUD_STORE_REDIS_HOST']);

rClt.auth(process.env['DOTCLOUD_STORE_REDIS_PASSWORD'], function(err) {
    if (err) {
        console.log(err);
        console.trace();
        process.exit(1);
    }
});



stack.io({ registrar: process.env['REGISTRAR_ENDPOINT'] }, function(error, client) {
    if (error) {
        console.log(error);
        console.trace();
        process.exit(1);
    }

    client.expose('redis', {
        del: function(key, callback) {
            if (typeof key !== 'string' && !key.length) {
                return callback('key must be a string or array of keys');
            }

            if (typeof key == 'string') {
                rClt.del(key, callback);
            } else {
                key.push(callback);
                rClt.del.apply(rClt, key);
            }
        },
        set: function(key, val, callback) {
            if (typeof val == 'object' || typeof val == 'function') {
                return callback('Can only set simple values (bool, string, number)');
            }

            if (typeof key !== 'string') {
                return callback('key must be a string');
            }

            rClt.set(key, val, callback);
        },

        get: function(key, callback) {
            if (typeof key !== 'string') {
                return callback('key must be a string');
            }

            rClt.get(key, callback);
        },

        keys: function(pattern, callback) {
            if (typeof pattern != 'string') {
                return callback('pattern must be a string');
            }

            rClt.keys(pattern, callback);
        },

        randomkey: function(callback) {
            rClt.randomkey(callback);
        }
    });
});