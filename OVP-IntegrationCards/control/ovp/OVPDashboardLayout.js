sap.ui.define([
    "sap/ovp/ui/DashboardLayout",
    "sap/ovp/ui/DashboardLayoutUtil",
    "sap/ui/core/Control",
    "sap/ui/Device"
], function (DashboardLayout, DashboardLayoutUtil, Control, Device) {
    'use strict';
    return DashboardLayout.extend('vistex.control.ovp.OVPDashboardLayout', {

        metadata: {
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
                visible: true,
                cards: []
            };

            if (this.getCards() && this.getContent().length === 0) {
                // this.removeAllContent();
                for (var i = 0; i < this.getCards().length; i++) {
                    var oCard = this.getCards()[0];
                    oCard.layoutConfig = {
                        "cardType": "custom",
                            "settings": {
                            "listType": "condensed"
                        },
                        "id": oCard.getId()
                    };

                    if (oCard.getColSpan()) {
                        oCard.layoutConfig.settings.defaultSpan = {
                            cols: oCard.getColSpan()
                        };
                    }

                    oCard.setLayoutConfig(oCard.layoutConfig);
                    oLayoutConfig.cards.push(oCard.getLayoutConfig());

                    oCard.addDelegate({
                        onAfterRendering: function (oEvent) {
                            var card = oEvent.srcControl;
                            var dashboardLayoutUtil = oCard.getParent().getParent().oContainer.getParent().dashboardLayoutUtil;

                            if (dashboardLayoutUtil && dashboardLayoutUtil.isCardAutoSpan(card.getId())) {
                                dashboardLayoutUtil.setAutoCardSpanHeight(null, card.getId(), card.$().height());
                            }
                        }
                    });

                    var oComponent = this.getComp(oCard.getId());
                    oComponent.card.setInnerCard(this.getCards()[0]);
                    --i;

                    var oContainer = new sap.ui.core.ComponentContainer({
                        component: oComponent
                    });

                    this.addContent(oContainer);
                }
                this.uiModel.setData(oLayoutConfig);

                this.dashboardLayoutUtil = new DashboardLayoutUtil(this.uiModel);
                this.dashboardLayoutUtil.setLayout(this);
            }
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

                if (aCards.length && filteredItems.length) {
                    for (var i = 0; i < aCards.length; i++) {
                        for (var j = 0; j < filteredItems.length; j++) {
                            if (aCards[i].id === filteredItems[j].getComponentInstance().card.getInnerCard().getLayoutConfig().id) {
                                filteredItems[j].getComponentInstance().card.getInnerCard().getLayoutConfig().dashboardLayout = aCards[i].dashboardLayout;
                            }
                        }
                    }
                }

                if (aCards.length === 0 && filteredItems.length) {
                    for (var i = 0; i < filteredItems.length; i++) {
                        aCards.push(filteredItems[i].getComponentInstance().card.getInnerCard().getLayoutConfig());
                    }
                }

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

                // if (aCards.length > 0) {
                var card = {}, counter, iLength, bSideCard,
                    colCount = oControl.getDashboardLayoutModel().getColCount();

                for (counter = 0, iLength = filteredItems.length; counter < iLength; counter++) {
                    var aStyleClasses = ['easyScanLayoutItemWrapper', 'sapOvpDashboardLayoutItem'];
//						card = aCards.filter(filterById.bind(filteredItems[counter]))[0];
                    card = aCards[counter];
                    //re-set css values for current card
                    if (card) {
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
                        oRm.renderControl(filteredItems[counter]);
                        oRm.write("<div class='lastElement' tabindex='0'></div>");
                        oRm.write("</div>");
                    }
                }
                // }

                oRm.write("</div>");
                // dummy after focusable area
                oRm.write("<div class='after' tabindex='0'></div>");
                oRm.write("</div>");
            }
        },

        getComp: function (id) {
            var oComp = sap.ui.getCore().createComponent({
                name: "vistex.control.ovp",
                id: id + "-OVPCardComp",
                settings: {}
            });

            return oComp;
        }
    });
});