sap.ui.define([
	"sap/ui/core/ComponentContainer",
	"sap/ui/Device",
	"vistex/poc/ovp/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ovp/ui/DashboardLayoutUtil"
	], function(ComponentContainer, Device, Controller, Filter, FilterOperator, JSONModel, DashboardLayoutUtil) {
	"use strict";

	return Controller.extend("vistex.poc.ovp.controller.DashboardLayout", {

		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("dashboardLayout").attachPatternMatched(this._onRouteMatched, this);

			var cardManifests = new sap.ui.model.json.JSONModel();
			this.getView().setModel(cardManifests, "data");
		},

		_onRouteMatched: function () {
			this.updatePageHeader("DashboardLayout", "dashboardLayout");
			this.loadData();
		},

		loadData: function () {
			this.getView().getModel("data").loadData("models/cardManifest.json");
		}
	});

});