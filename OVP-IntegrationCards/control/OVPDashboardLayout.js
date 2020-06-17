sap.ui.define([
    "sap/ovp/ui/DashboardLayout",
    "sap/ovp/ui/DashboardLayoutUtil",
    "sap/ui/core/Control",
    "sap/ui/Device"
], function (DashboardLayout, DashboardLayoutUtil, Control, Device) {
    'use strict';
    return DashboardLayout.extend('vistex.poc.ovp.control.OVPDashboardLayout', {

        metadata: {
            properties: {
                layoutConfig: {
                    type: "object"
                }
            },
            aggregations: {
                cards: {
                    type: "sap.ui.integration.widgets.Card",
                    multiple: true,
                    singularName: "card"
                }
            },
        },

        init: function (oEvent) {
            this.uiModel = new sap.ui.model.json.JSONModel();
            this.data("sap-ui-fastnavgroup", "true", true);
            this.oColumnLayoutData = {};
            this.resizeHandlerId = this.initResizeHandler();
        },

        onBeforeRendering: function () {
            var oLayoutConfig = {
                cards: []
            };

            if (this.getCards()) {
                for (var i=0;i<this.getCards().length;i++) {
                    if (this.getCards()[i].getLayoutConfig()) {
                        oLayoutConfig.cards.push(this.getCards()[i].getLayoutConfig());
                        // this.addContent(this.getCards()[i]);
                    }
                }
            }
            this.uiModel.setData(oLayoutConfig);
            // this.uiModel.setData(this.getLayoutConfig());

            this.dashboardLayoutUtil = new DashboardLayoutUtil(this.uiModel);
            this.dashboardLayoutUtil.setLayout(this);
        },

        renderer: {

            render: function (oRm, oControl) {

                if (!oControl.dashboardLayoutUtil) {
                    return;
                }

                // get viewport width depending layout data
                var ctrlWidth = oControl.$().width();
                var bRTL = sap.ui.getCore().getConfiguration().getRTL();
                var oLayoutData = oControl.dashboardLayoutUtil.updateLayoutData(ctrlWidth ? ctrlWidth : jQuery(window).width());
                var aCards = oControl.dashboardLayoutUtil.getCards(oLayoutData.colCount);

                function filterVisibleCards(element) {
                    return element.getVisible();
                }

                function filterById(element) {
                    return element.id === this.getId().split("--")[1];
                }

                var filteredItems = oControl.getContent().filter(filterVisibleCards);
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("sapUshellEasyScanLayout");
                if (!Device.system.phone) {
                    oRm.addClass("sapOvpDashboardDragAndDrop");
                }
                oRm.addClass("sapOvpDashboard");
                oRm.writeClasses();
                bRTL ? oRm.addStyle("margin-right", oLayoutData.marginPx + "px") : oRm.addStyle("margin-left", oLayoutData.marginPx + "px");
                oRm.writeStyles();
                oRm.write(">");
                oRm.write("<div class='sapUshellEasyScanLayoutInner' role='list' aria-label='Cards' tabindex='0'>");

                if (aCards.length > 0) {
                    var card = {}, counter, iLength, bSideCard,
                        colCount = oControl.getDashboardLayoutModel().getColCount();

                    for (counter = 0, iLength = filteredItems.length; counter < iLength; counter++) {
                        var aStyleClasses = ['easyScanLayoutItemWrapper', 'sapOvpDashboardLayoutItem'];
//						card = aCards.filter(filterById.bind(filteredItems[counter]))[0];
                        card = aCards[counter];
                        //re-set css values for current card
                        oControl.dashboardLayoutUtil.setCardCssValues(card);
                        bSideCard = card.dashboardLayout.column + card.dashboardLayout.colSpan === colCount + 1;
                        if (bSideCard) {
                            card.dashboardLayout.colSpan === 1 ? aStyleClasses.push('sapOvpNotResizableLeftRight') : aStyleClasses.push('sapOvpNotResizableRight');
                        }
                        if (card.template === 'sap.ovp.cards.stack' || card.settings.stopResizing || !Device.system.desktop) {
                            aStyleClasses.push('sapOvpDashboardLayoutItemNoDragIcon');
                        }

                        oRm.write("<div id='" + oControl.dashboardLayoutUtil.getCardDomId(card.id) +
                            "' class='" + aStyleClasses.join(' ') + "' style='" +
                            "; transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; -ms-transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; -moz-transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; -webkit-transform:translate3d(" + card.dashboardLayout.left + " ," + card.dashboardLayout.top + " ,0px)" +
                            "; height:" + card.dashboardLayout.height + "; width:" + card.dashboardLayout.width + ";'" +
                            " tabindex='0'; aria-setsize=" + iLength + " aria-posinset=" + (counter + 1));
                        oRm.writeAccessibilityState(undefined, {role: "listitem"});
                        oRm.write(">");

                        if (filteredItems[counter].getId()) {

                            var oComponent = oControl.getComp(filteredItems[counter].getId());

                            var aCard = oControl.getCards();

                            if (aCard[0]) {
                                oComponent.card.setInnerCard(aCard[0]);

                                oComponent.card.getInnerCard().addDelegate({
                                    onAfterRendering: function (oEvent) {
                                        var oCard = oEvent.srcControl;
                                        var dashboardLayoutUtil = oCard.getParent().getParent().oContainer.getParent().dashboardLayoutUtil;

                                        if (dashboardLayoutUtil && dashboardLayoutUtil.isCardAutoSpan(oCard.getId())) {
                                            var $wrapper = jQuery("#" + dashboardLayoutUtil.getCardDomId(oCard.getId()));
                                            dashboardLayoutUtil.setAutoCardSpanHeight(null, oCard.getId(), oCard.$().height());
                                        }
                                    }
                                });

                                filteredItems[counter].setComponent(oComponent);
                                oRm.renderControl(filteredItems[counter]);
                            }
                        }

                        oRm.write("<div class='lastElement' tabindex='0'></div>");
                        oRm.write("</div>");
                    }
                }

                oRm.write("</div>");
                // dummy after focusable area
                oRm.write("<div class='after' tabindex='0'></div>");
                oRm.write("</div>");
            }
        },

        getComp: function (id) {
            var oComp1 = sap.ui.getCore().createComponent({
                name: "vistex.poc.ovp.ovp1",
                id: id + "-Comp1",
                settings: {}
            });

            return oComp1
        }
    });

});