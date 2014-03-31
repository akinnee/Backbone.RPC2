Backbone.RPC2
=============

Use Backbone with a JSON RPC 2.0 API

# Requirements

Lo-Dash (not the Underscore build) or Underscore with a shim to make _.deepClone work.

# Usage

```
// We used the https://github.com/umdjs/umd pattern,
// so this works with requirejs, node require, commonjs, etc.
var RPC2 = require('backbone.rpc2');

var BaseModel = RPC2.Model.extend({
    
    url: 'https://url.to/jsonrpc/service',
    
    rpcOptions: {
    
        // http headers to send to api
        headers: {
            'X-Client-Type': 'API'
        },
        
        // map backbone CRUD methods to RPC methods
        methods: {
        
            create: {
                // name of method on server
                method: 'create_something',
                
                // params to send,
                // can also be a function which returns the params object
                // Example: function(model) { return { name: model.get(name) }; }
                params: {
                    // prepend "attributes." to the beginning of a string to send an attribute of the model
                    // send the models name
                    name: 'attributes.name',
                    
                    // send a fixed boolean, object, string, etc.
                    is_awesome: true
                }
            },
            
            // other methods follow the same format
            read: ...
            update: ...
            delete: ...
        
        }
    }
    
});
```
