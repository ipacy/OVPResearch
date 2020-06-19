sap.ui.define([
	"sap/ui/core/mvc/Controller"
	], function(Controller) {
	"use strict";

	return Controller.extend("vistex.poc.ovp.controller.BaseController", {

		swapView: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo(oEvent.getSource().getSelectedKey());
		},

		updatePageHeader: function(sTitle, sKey) {
		//	this.getView().byId("idPageTitle").setText(sTitle);
		//	this.getView().byId("idSwapSegmentedButton").setSelectedKey(sKey);
		}

	});

});