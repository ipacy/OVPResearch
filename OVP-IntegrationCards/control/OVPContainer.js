sap.ui.define([
        "sap/ui/core/Control",
        "vistex/poc/ovp/control/OVPDashboardLayout"
    ],
    function (Control, OVPDashboardLayout) {
        "use strict";

        var OVPContainer = Control.extend("vistex.poc.ovp.control.OVPContainer", {
            metadata: {
                defaultAggregation: "content",
                aggregations: {
                    content: {
                        type: 'sap.ui.core.Control',
                        multiple: true
                    },
                    _dashboardLayout: {
                        type: 'vistex.poc.ovp.control.OVPDashboardLayout',
                        multiple: false,
                        visibility: 'hidden'
                    }
                }
            },

            init: function () {
                this.setAggregation('_dashboardLayout', new OVPDashboardLayout());
            },

            renderer: function (oRm, oControl) {
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.write(">");

                var oLayout = oControl.getAggregation("_dashboardLayout");

                for (var i = 0; i < oControl.getContent().length; i++) {
                    oLayout.addCard(oControl.getContent()[i]);
                }

                oRm.renderControl(oLayout);

                oRm.write("</div>");
            }
        });

        // let oMetadata = OVPContainer.getMetadata();
        // oMetadata.forwardAggregation(
        //     'content',
        //     {
        //         getter: function () {
        //             return this.getAggregation('_dashboardLayout');
        //         },
        //         aggregation: 'cards',
        //         forwardBinding: true
        //     }
        // );

        return OVPContainer;
    }
);