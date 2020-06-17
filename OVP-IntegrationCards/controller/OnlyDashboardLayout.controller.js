sap.ui.define([
	"sap/ui/core/ComponentContainer",
	"nw/epm/refapps/st/overview/localService/mockserver",
	"sap/ui/Device",
	"vistex/poc/ovp/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ovp/ui/DashboardLayoutUtil"
	], function(ComponentContainer, server, Device, Controller, Filter, FilterOperator, JSONModel, DashboardLayoutUtil) {
	"use strict";

	return Controller.extend("vistex.poc.ovp.controller.DashboardLayout", {

		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("onlyDashboardLayout").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			server.init();
		}
	});

});