/**
 * RPC2
 * A Backbone plugin that allows Models and Collections to be retrieved and updated over JSON RPC 2.0
 * instead of REST
 */

/**
 * Helpers
 */
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
			options.success(model, response, options);

		};

		var error = function(response) {

			// call the error callback
			options.error(model, response, options);

		};

		if (method == "create") {
			client.call(model.rpcOptions.methods.create.method, model.constructParams("create"), success, error);

		} else if (method == "read") {
			client.call(model.rpcOptions.methods.read.method, model.constructParams("read"), success, error);

		} else if (method == "update") {
			client.call(model.rpcOptions.methods.update.method, model.constructParams("update"), success, error);

		} else if (method == "delete") {
			client.call(model.rpcOptions.methods.delete.method, model.constructParams("delete"), success, error);
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
						name: 'name'
					}
				},
				read: {
					method: 'read',
					params: {
						id: 'id'
					}
				},
				update: {
					method: 'update',
					params: {
						id: 'id',
						name: 'name'
					}
				},
				'delete': {
					method: 'delete',
					params: {
						id: 'id'
					}
				}
			}
		},

		/**
		 * Create the params object based on the method we're calling
		 */
		constructParams: function(method) {

			var model = this;
			var params = {};

			$.each(this.rpcOptions.methods[method].params, function(param, attribute) {

				if (model.get(attribute)) {
					params[param] = model.get(attribute);
				}

			});

			return params;

		},

		/**
		 * Maps to our custom sync method
		 */
		sync: function(method, model, options) {
			return RPC2.sync(method, model, options);
		}

	});

}());