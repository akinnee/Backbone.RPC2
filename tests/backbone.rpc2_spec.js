$(function() {
	describe("Backbone.RPC2", function() {

		var errorSpy,
			completeSpy,
			TestModel,
			model,
			collection;

		TestModel = Backbone.RPC2.Model.extend({
			url: 'http://localhost:5080'
		});

		beforeEach(function() {
			// create an error callback to be used in our CRUD tests
			errorSpy = jasmine.createSpy('error');
			completeSpy = jasmine.createSpy('complete');

			model = new TestModel({
				id: 123,
				name: 'Create of oranges'
			});

			collection = new Backbone.RPC2.Collection();
		});

		afterEach(function() {
			// the error callback should not have been called
			expect(errorSpy).not.toHaveBeenCalled();
		});

		/**
		 * Test setup which happens when the plugin is loaded
		 */

		it("adds the RPC2 object to the Backbone object", function() {
			expect(Backbone.RPC2).toBeDefined();
		});

		it("adds has a Util object", function() {
			expect(Backbone.RPC2.Util).toBeDefined();
		});

		it("defines a custom sync method", function() {
			expect(Backbone.RPC2.sync).toBeDefined();
		});

		it("has a new kind of model", function() {
			expect(Backbone.RPC2.Model).toBeDefined();
		});

		it("has a new kind of collection", function() {
			expect(Backbone.RPC2.Collection).toBeDefined();
		});

		it("uses the custom sync method for the new model", function() {
			spyOn(Backbone.RPC2, 'sync');
			model.sync();
			expect(Backbone.RPC2.sync).toHaveBeenCalled();
		});

		it("calls the custom sync method when fetching the new model", function() {
			spyOn(Backbone.RPC2, 'sync');
			model.fetch();
			expect(Backbone.RPC2.sync).toHaveBeenCalled();
		});

		/**
		 * Test our common Util methods
		 */

		// RPC2.Util.inheritRpcOptions
		it("allows models to recursively inherit the rpcOptions from the model's __super__", function() {
			var SomeModel,
				someModelInstance;

			SomeModel = Backbone.RPC2.Model.extend({
				rpcOptions: {
					methods: {
						create: {
							method: 'makeSomething'
						}
					}
				},
				initialize: function() {
					this.inheritRpcOptions();
				}
			});

			someModelInstance = new SomeModel();

			// the option we set should be there
			expect(someModelInstance.rpcOptions.methods.create.method).toBe('makeSomething');
			// but also, the option we inherited from Backbone.RPC2.Model should be there
			expect(someModelInstance.rpcOptions.methods.read.method).toBe('read');
		});
		it("allows models to recursively inherit the rpcOptions from any object", function() {
			var SomeModel,
				someModelInstance;

			SomeModel = Backbone.RPC2.Model.extend({
				rpcOptions: {
					methods: {
						create: {
							method: 'makeSomething'
						}
					}
				},
				initialize: function() {
					this.inheritRpcOptions({
						methods: {
							update: {
								method: 'changeSomething'
							}
						}
					});
				}
			});

			someModelInstance = new SomeModel();

			// the option we set should be there
			expect(someModelInstance.rpcOptions.methods.create.method).toBe('makeSomething');
			// but also, the option we inherited from our object should be there
			expect(someModelInstance.rpcOptions.methods.update.method).toBe('changeSomething');
		});

		// RPC2.Util.constructParams
		it("constructs request params based on what is configured", function() {
			var params;

			params = model.constructParams('create');
			expect(params).toEqual({ name: "Create of oranges" });

			params = model.constructParams('read');
			expect(params).toEqual({ id: 123 });

			params = model.constructParams('update');
			expect(params).toEqual({ id: 123, name: "Create of oranges" });

			params = model.constructParams('delete');
			expect(params).toEqual({ id: 123 });
		});
		it("can construct params from a function", function() {
			var params;
			model.rpcOptions.methods.create.params = function() {
				return {
					name: 'testing123'
				};
			};
			params = model.constructParams('create');
			expect(params).toEqual({ name: "testing123" });
		});

		/**
		 * Test our async CRUD methods for models
		 */

		// CREATE
		it("can fetch models from a server", function(done) {
			expect(model.get('name')).toBe('Create of oranges');
			model.fetch({
				success: function() {
					expect(model.get('name')).toBe('Box of matches');
					done();
				},
				error: function() { errorSpy(); done(); }
			});
		});

		// READ
		it("can save new models to a server", function(done) {
			model.save({
				name: 'Jar of salsa'
			}, {
				success: function(model, response) {
					expect(response.name).toBe('Jar of salsa');
					done();
				},
				error: function() { errorSpy(); done(); }
			});
		});

		// UPDATE
		it("can change models and save the changes to a server", function(done) {
			model.fetch({
				success: function() {
					model.set('name', 'Can of beans');
					model.save({}, {
						success: function(model, response) {
							expect(response.name).toBe('Can of beans');
							done();
						},
						error: function() { errorSpy(); done(); }
					});
				},
				error: function() { errorSpy(); done(); }
			});
		});

		// DELETE
		it("can delete models from a server", function(done) {
			model.destroy({
				success: function() { done(); },
				error: function() { errorSpy(); done(); }
			});
		});

	});
});