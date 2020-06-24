sap.ui.define([
        "sap/ui/integration/library",
        "sap/ui/core/UIComponent",
        "sap/f/cards/BaseContent",
        "sap/ui/integration/widgets/Card",
        "sap/f/cards/BindingHelper",
        "sap/base/Log",
        "sap/ovp/ui/DashboardLayoutUtil",
        "sap/ovp/ui/DashboardLayoutRearrange",
        "vistex/poc/ovp/control/ovp/CustomContent"],
    function (library, UIComponent, BaseContent, Card, BindingHelper, Log, DashboardLayoutUtil, Rearrange) {
        "use strict";
        return UIComponent.extend("vistex.poc.ovp.Component", {
            metadata: {
                manifest: "json"
            },

            init: function () {
                UIComponent.prototype.init.apply(this, arguments);
                this.getRouter().initialize();

                sap.ovp.ui.DashboardLayoutModel.prototype._mergeLayoutVariants = function (oSourceObject, oDestinationObject) {
                    if (oDestinationObject.rowSpan) {
                        oSourceObject.rowSpan = oSourceObject.rowSpan ? oSourceObject.rowSpan : oDestinationObject.rowSpan;
                    }
                    if (oDestinationObject.colSpan) {
                        oSourceObject.colSpan = oDestinationObject.colSpan;
                    }
                    if (oDestinationObject.maxColSpan) {
                        oSourceObject.maxColSpan = oDestinationObject.maxColSpan;
                    }
                    if (oDestinationObject.noOfItems) {
                        oSourceObject.noOfItems = oDestinationObject.noOfItems;
                    }
                    if (oDestinationObject.hasOwnProperty('autoSpan')) {
                        oSourceObject.autoSpan = oDestinationObject.autoSpan;
                    }
                    if (oDestinationObject.row) {
                        oSourceObject.row = oDestinationObject.row;
                    }
                    if (oDestinationObject.col) {
                        oSourceObject.column = oDestinationObject.col;
                    }
                    if (oDestinationObject.hasOwnProperty('showOnlyHeader')) {
                        oSourceObject.showOnlyHeader = oDestinationObject.showOnlyHeader;
                    }
                };
            }
        });
    });