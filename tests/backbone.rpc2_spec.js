$(function() {
	describe("Backbone.RPC2", function() {

		var model;

		beforeEach(function() {
			model = new Backbone.RPC2.Model();
		});

		it("adds the RPC2 object to the Backbone object", function() {
			expect(Backbone.RPC2).toBeDefined();
		});

		it("defines a custom sync method", function() {
			expect(Backbone.RPC2.sync).toBeDefined();
		});

		it("adds a new kind of model", function() {
			expect(Backbone.RPC2.Model).toBeDefined();
		});

		it("adds a new kind of collection", function() {
			expect(Backbone.RPC2.Collection).toBeDefined();
		});

		it("uses the custom sync method for the new model", function() {
			expect(model.sync).toEqual(Backbone.RPC2.sync);
		});

	});
});