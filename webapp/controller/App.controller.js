sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("webar-test.controller.App", {
		onInit: function() {
			this.arView = this.byId("arView");
		},
		onShowHello: function() {
			debugger;
			MessageToast.show("Hello World");
		}
	});
});