// In mock mode, the mock server intercepts HTTP calls and provides fake output to the
// client without involving a backend system. But special backend logic, such as that
// performed by function imports, is not automatically known to the mock server. To handle
// such cases, the app needs to define specific mock requests that simulate the backend
// logic using standard HTTP requests (that are again interpreted by the mock server) as
// shown below.

sap.ui.define(["sap/ui/base/Object"], function(Object) {
	"use strict";

	return Object.extend("nw.epm.refapps.st.overview.localService.MockRequests", {
		constructor: function(oMockServer) {
			this._oMockServer = oMockServer;
			// register handler for requets that are also handled by the mock server - the application adds 
			// functionality
		},

		getRequests: function() {
			// handler for equests that are not treated by the mock server
			return [this.mockApprovePo(), this.mockRejectPo()];
		},

		mockApprovePo: function() {
			return {
				// This mock request simulates the function import "ApprovePurchaseOrder",
				// which is triggered when the user chooses the "Approve" button.
				// It removes the approved purchase order from the mock data.
				method: "POST",
				path: new RegExp("SEPMRA_C_OVW_POApproveApprove\\?PurchaseOrder='(\\d{9,10})'&Reason='(.*)'"),
				response: function(oXhr, sPOId) {
					this.deletePo(oXhr, sPOId);
				}.bind(this)
			};
		},

		mockRejectPo: function() {
			return {
				// This mock request simulates the function import "RejectPurchaseOrder",
				// which is triggered when the user chooses the "Reject" button.
				// It removes the rejected purchase order from the mock data.
				method: "POST",
				path: new RegExp("SEPMRA_C_OVW_POApproveReject\\?PurchaseOrder='(\\d{9,10})'&Reason='(.*)'"),
				response: function(oXhr, sPOId) {
					this.deletePo(oXhr, sPOId);
				}.bind(this)
			};
		},

		deletePo: function(oXhr, sPOId) {
			var aPurchaseOrders = this._oMockServer.getEntitySetData("SEPMRA_C_OVW_POApprove"),
				filterPurchaseOrder = function(oPurchaseOrder) {
					return oPurchaseOrder.PurchaseOrder !== sPOId;
				};
			aPurchaseOrders = aPurchaseOrders.filter(filterPurchaseOrder);
			this._oMockServer.setEntitySetData("SEPMRA_C_OVW_POApprove", aPurchaseOrders);
			oXhr.respondJSON(200, {}, JSON.stringify({
				d: {
					results: []
				}
			}));
		}
	});
});