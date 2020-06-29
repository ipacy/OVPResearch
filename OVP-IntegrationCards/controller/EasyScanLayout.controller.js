sap.ui.define([
	"sap/ui/Device",
	"vistex/poc/ovp/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
	], function(Device, Controller, Filter, FilterOperator, JSONModel) {
	"use strict";

	return Controller.extend("vistex.poc.ovp.controller.EasyScanLayout", {

		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("easyScanLayout").attachPatternMatched(this._onRouteMatched, this);
		},

        _onRouteMatched: function () {
        	
			var cardManifests = new sap.ui.model.json.JSONModel();
			cardManifests.loadData("models/cardManifest.json");

			this.getView().setModel(cardManifests, "data");

			this.updatePageHeader("EasyScanLayout", "easyScanLayout");
        },

		onPress: function() {
			this.getView().getModel("data").loadData("models/cardManifest2.json");
		},

		onAction: function (oEvent) {
			if (oEvent.getParameter("type") === sap.ui.integration.library.integrationLibrary.CardActionType.Navigation) {
				MessageToast.show("URL: " + oEvent.getParameter("parameters").url);
			}
		}

	});

});