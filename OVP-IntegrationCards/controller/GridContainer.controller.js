sap.ui.define([
	"sap/ui/Device",
	"vistex/poc/ovp/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
	], function(Device, Controller, Filter, FilterOperator, JSONModel) {
	"use strict";

	return Controller.extend("vistex.poc.ovp.controller.GridContainer", {

		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("gridContainer").attachPatternMatched(this._onRouteMatched, this);

			this.getView().byId("gridContainer").addDelegate({
				onAfterRendering: function(oEvent) {
					var oControl = oEvent.srcControl;
					var sWidth = oControl.$().width();
//					var gap = oControl.getLayoutL().getGap();
//					var totalGap = 16*

					var finalWidth = (sWidth / 22 ) + "px";

					oControl.getLayoutXL().setColumnSize(finalWidth);
					oControl.getLayoutXL().setRowSize(finalWidth);

					oControl.getLayoutL().setColumnSize(finalWidth);
					oControl.getLayoutL().setRowSize(finalWidth);

					oControl.getLayoutM().setColumnSize(finalWidth);
					oControl.getLayoutM().setRowSize(finalWidth);

				}
			});
		},

		_onRouteMatched: function () {

			var cardManifests = new sap.ui.model.json.JSONModel();
			cardManifests.loadData("models/cardManifest.json");

			this.getView().setModel(cardManifests, "data");

		},

		onAction: function (oEvent) {
			if (oEvent.getParameter("type") === sap.ui.integration.library.integrationLibrary.CardActionType.Navigation) {
				MessageToast.show("URL: " + oEvent.getParameter("parameters").url);
			}
		}

	});

});