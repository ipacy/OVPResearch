//define a new (simple) UIComponent
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.declare("vistex.poc.ovp.ovp1.Component");

//new Component
sap.ui.core.UIComponent.extend("vistex.poc.ovp.ovp1.Component", {});


vistex.poc.ovp.ovp1.Component.prototype.createContent = function() {
	this.card = sap.ui.xmlfragment("vistex.poc.ovp.ovp1.list1", this);

	return this.card; 
};