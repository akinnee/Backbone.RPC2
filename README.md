Backbone.RPC2
=============

Use Backbone with a JSON RPC 2.0 API

# Usage

```
// works with requirejs, node require, commonjs, etc.
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
                
                // params to send
                params: {
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
