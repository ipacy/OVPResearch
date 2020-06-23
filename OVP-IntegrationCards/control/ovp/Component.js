sap.ui.define([
		"sap/ui/core/UIComponent"
	],
	function (UIComponent) {
		"use strict";

		return UIComponent.extend("vistex.control.ovp.Component", {

			createContent: function() {
				this.card = sap.ui.xmlfragment("vistex.control.ovp.OVPCard", this);
				return this.card;
			}
		});
	}
);