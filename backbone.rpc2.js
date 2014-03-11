/**
 * RPC2
 * A Backbone plugin that allows Models and Collections to be retrieved and updated over JSON RPC 2.0
 * instead of REST
 */

/**
 * Helpers
 */
// Fallback to JSON.stringify if $.toJSON is not available
if (typeof $.toJSON === 'undefined') {
	$.toJSON = function(object) {
		return JSON.stringify(object);
	};
}

/**
 * The actual plugin
 */
(function () {

	// Define the RPC2 plugin
	var RPC2 = {};

	// Attach our plugin to Backbone
	Backbone.RPC2 = RPC2;

	/**
	 * A custom sync method to use JSON RPC
	 * @param  {[string]} method – the CRUD method ("create", "read", "update", or "delete")
	 * @param  {[object]} model – the model to be saved (or collection to be read)
	 * @param  {[type]} options – success and error callbacks, and all other jQuery request options
	 */
	RPC2.sync = function(method, model, options) {

		var client = new $.JsonRpcClient({
			ajaxUrl: model.url,
			headers: model.rpcOptions.headers
		});

		var success = function(response) {

			// call the success callback
			options.success(response);

		};

		var error = function(response) {

			// call the error callback
			options.error(response);

		};

		// construct the params based on the rpcOptions
		var payload = model.constructParams(method);

		// add any data passed in to the payload
		if (typeof options.data === 'object') {
			payload = _.extend(payload, options.data);
		}

		// make the call, passing in our success and error handlers and returning the deferred object that jQuery $.ajax returns
		var deferred = client.call(model.rpcOptions.methods[method].method, payload, success, error);

		return deferred;
	};

	/**
	 * Utility methods used by RPC2.Model and RPC2.Collection
	 */
	RPC2.Util = {
		/**
		 * Inherits undefined options in the rpcOptions object from the super class
		 * @param  {[object]} rpcOptions - The rpcOptions to inherit from; defaults to the super class's rpcOptions
		 */
		inheritRpcOptions: function(rpcOptions) {
			if (!rpcOptions) {
				rpcOptions = this.constructor.__super__.rpcOptions;
			}
			this.rpcOptions = this.recursivelyInheritRpcOptions(this.rpcOptions, rpcOptions, 'rpcOptions');
		},
		recursivelyInheritRpcOptions: function(rpcOptions, superRpcOptions, parentKey) {
			// only inherit the following properties if they are undefined
			var dontRecursivelyInherit = [
				'rpcOptions.headers',
				'methods.create', 'methods.read', 'methods.update', 'methods.delete'
			];
			var model = this;
			$.each(superRpcOptions, function(key, value) {
				if (typeof rpcOptions[key] === 'undefined') {
					rpcOptions[key] = value;

				// if this key is an object, we'll recursively pull unset options from it
				// we won't touch anything inside the options defined in the dontRecursivelyInherit array
				} else if (typeof rpcOptions[key] === 'object' && _.indexOf(dontRecursivelyInherit, parentKey+'.'+key) === -1) {
					rpcOptions[key] = model.recursivelyInheritRpcOptions(rpcOptions[key], superRpcOptions[key], key);

				}
			});
			return rpcOptions;
		},

		/**
		 * Create the params object based on the method we're calling
		 */
		constructParams: function(method) {
			// get the params for this method
			var params = this.rpcOptions.methods[method].params;
			if (typeof params !== 'function') {
				// copy params so we aren't modifying the config object
				params = _.extend({}, params);
			}

			// params might be a function
			if (typeof params === 'function') {
				params = params(this);
			}

			if (!params) {
				params = [];
			}

			// params can be deeply nested
			return this.recursivelySetParams(params);
		},
		recursivelySetParams: function(params) {

			var model = this;

			$.each(params, function(param, attribute) {
				// if this attrbite is an object (or an array), we should recurse into it any update its attributes
				if (typeof attribute === 'object') {
					attribute = model.recursivelySetParams(attribute);

				} else if (typeof attribute === 'string') {
					// use a model from the attribute if the string starts with "attributes."
					if (attribute.indexOf('attributes.') === 0) {
						var model_attribute = attribute.replace('attributes.', '');
						if (typeof model.get(model_attribute) !== 'undefined') {
							params[param] = model.get(model_attribute);
						} else {
							// get rid of params which reference undefined model attributes
							delete params[param];
						}
					}
					// otherwise use the string that was given in configuration
				}

			});

			return params;

		}
	};

	/**
	 * Backbone.RPC2.Model
	 * An extension of Backbone.Model which uses RPC2.sync instead of the default Backbone.sync
	 */
	RPC2.Model = Backbone.Model.extend({

		/**
		 * Important options for RPC for this model
		 */
		url: 'path/to/my/rpc/handler',
		rpcOptions: {
			headers: {},
			methods: {
				create: {
					method: 'create', // name of the method to call for CREATE
					params: { // param_name: 'model_attribute'
						name: 'attributes.name'
					}
				},
				read: {
					method: 'read',
					params: {
						id: 'attributes.id'
					}
				},
				update: {
					method: 'update',
					params: {
						id: 'attributes.id',
						name: 'attributes.name'
					}
				},
				'delete': {
					method: 'delete',
					params: {
						id: 'attributes.id'
					}
				}
			}
		},

		/**
		 * Utility methods
		 */
		inheritRpcOptions:				RPC2.Util.inheritRpcOptions,
		recursivelyInheritRpcOptions:	RPC2.Util.recursivelyInheritRpcOptions,
		constructParams:				RPC2.Util.constructParams,
		recursivelySetParams:			RPC2.Util.recursivelySetParams,

		/**
		 * Maps to our custom sync method
		 */
		sync: function(method, model, options) {
			return RPC2.sync(method, model, options);
		}

	});

	/**
	 * Backbone.RPC2.Collection
	 * An extension of Backbone.Collection which uses RPC2.sync instead of the default Backbone.sync
	 */
	RPC2.Collection = Backbone.Collection.extend({

		/**
		 * Important options for RPC for this model
		 */
		url: 'path/to/my/rpc/handler',
		rpcOptions: {
			headers: {},
			methods: {
				read: {
					method: 'readCollection',
					params: {}
				},
				update: {
					method: 'updateCollection',
					params: function(collection) { return collection.toJSON(); }
				}
			}
		},

		/**
		 * Utility methods
		 */
		inheritRpcOptions:				RPC2.Util.inheritRpcOptions,
		recursivelyInheritRpcOptions:	RPC2.Util.recursivelyInheritRpcOptions,
		constructParams:				RPC2.Util.constructParams,
		recursivelySetParams:			RPC2.Util.recursivelySetParams,

		/**
		 * Maps to our custom sync method
		 */
		sync: function(method, model, options) {
			return RPC2.sync(method, model, options);
		}

	});

}());