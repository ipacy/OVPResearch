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

                sap.ovp.ui.DashboardLayoutUtil.prototype._triggerCardResize = function (oCard) {
                    var cardLayout = oCard.dashboardLayout,
                        cardId = oCard.id,
                        cardComponentId = this._getCardComponentDomId(cardId),
                        $card = document.getElementById(cardComponentId),
                        oGenCardCtrl = this._getCardController(cardId),
                        cardSizeProperties, oCardBinding, iContainerHeight;
                    try {

                        var iNoOfItems = 10;
                        var itemLength = iNoOfItems ? Math.min(iNoOfItems, oCard.dashboardLayout.noOfItems) : oCard.dashboardLayout.noOfItems;
                        var iActualNoOfItems = (iNoOfItems === 0) ? oCard.dashboardLayout.noOfItems : itemLength;
                        var iCardHeight = cardLayout.rowSpan * this.ROW_HEIGHT_PX;
                        var iAvailableSpace = iCardHeight - (5 + 2 * this.CARD_BORDER_PX);

                        iContainerHeight = iActualNoOfItems * 5 + 2;
                        $card.style.height = Math.min(iContainerHeight, iAvailableSpace) + oCard.dashboardLayout.headerHeight + "px";

                        return;
                    } catch (error) {
                        Log.warning("Card auto span failed for card " + cardId + " and error is  " + error.toString());
                    }
                    //set height px data and layout (compatibility to card property model)
                    cardLayout.iRowHeightPx = this.getRowHeightPx();
                    cardLayout.iCardBorderPx = this.CARD_BORDER_PX;
                    try {
                        if (oGenCardCtrl) {
                            cardSizeProperties = this.calculateCardProperties(cardId);
                            oGenCardCtrl.resizeCard(cardLayout, cardSizeProperties);
                        } else {
                            Log.warning("OVP resize: no controller found for " + cardId);
                        }
                    } catch (err) {
                        Log.warning("OVP resize: " + cardId + " catch " + err.toString());
                    }
                };

                Rearrange.prototype._dragMoveHandler = function (actionObject) {
                    if (actionObject.element) {
                        var mainHeaderWrapperHeight = 0;
                        var uShellHeadHeight = 0;
                        var viewElement = document.getElementsByClassName("sapFDynamicPageContentWrapper")[0];
                        var viewTitleHeight = document.getElementsByClassName("sapFDynamicPageTitleWrapper")[0].offsetHeight;
                        if (document.getElementsByClassName("sapUshellShellHeadSearchContainer")[0]) {
                            uShellHeadHeight = document.getElementsByClassName("sapUshellShellHeadSearchContainer")[0].offsetHeight;
                        }
                        var viewHeight = viewElement.offsetHeight;
                        var viewRect = viewElement.getBoundingClientRect();
                        var updatedScrollTop;
                        if (document.getElementsByClassName("sapFDynamicPageHeader")[0]) {
                            mainHeaderWrapperHeight = document.getElementsByClassName("sapFDynamicPageHeader")[0].offsetHeight;
                        }
                        if ((actionObject.evt.clientY - viewElement.offsetTop + this.SCROLL_OFFSET) > viewHeight) {
                            viewElement.scrollTop = viewElement.scrollTop + this.SCROLL_OFFSET;
                            updatedScrollTop = viewElement.scrollTop;
                        } else if (((actionObject.evt.clientY - viewElement.offsetTop) < viewRect.top + this.SCROLL_OFFSET) && viewElement.scrollTop !== 0) {
                            viewElement.scrollTop = viewElement.scrollTop - this.SCROLL_OFFSET;
                            updatedScrollTop = viewElement.scrollTop;
                        } else {
                            updatedScrollTop = viewElement.scrollTop;
                        }
                        this.floaterData.id = actionObject.element.id;
                        this.floaterData.left = actionObject.clone.getBoundingClientRect().left;
                        this.floaterData.top = actionObject.clone.getBoundingClientRect().top + updatedScrollTop - (viewTitleHeight + mainHeaderWrapperHeight + uShellHeadHeight);

                        var iColumnValue = Math.round(this.floaterData.left / this.layoutUtil.getColWidthPx());
                        var newCardPosition = {
                            row: Math.round(this.floaterData.top / this.layoutUtil.getRowHeightPx()) + 1,
                            column: this.isRTLEnabled ? this.columnCount - iColumnValue : iColumnValue + 1
                        };
                        newCardPosition.row = newCardPosition.row <= 0 ? 1 : newCardPosition.row;
                        newCardPosition.column = newCardPosition.column <= 1 ? 1 : newCardPosition.column;
                        var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(this.layoutUtil.getCardId(this.floaterData.id));
                        //If the new position is beyond the viewport then move the card to the desired position
                        if (newCardPosition.column + oCard.dashboardLayout.colSpan > this.columnCount) {
                            newCardPosition.column = (this.columnCount - oCard.dashboardLayout.colSpan) + 1;
                        }
                        this.floaterData.row = newCardPosition.row;
                        this.floaterData.column = newCardPosition.column;

                        jQuery.when(this.layoutUtil.dashboardLayoutModel._arrangeCards(oCard, this.floaterData, 'drag', this.layoutUtil.dragOrResizeChanges)).done(function () {
                            this.layoutUtil._positionCards(this.aCards);
                            this.layoutUtil.dashboardLayoutModel._removeSpaceBeforeCard();
                        }.bind(this));

                        this.showGhostWhileDragMove({
                            row: oCard.dashboardLayout.row,
                            column: oCard.dashboardLayout.column
                        }, actionObject);
                    }
                };

                Rearrange.prototype.showGhostWhileDragMove = function (newCardPosition, actionObject) {
                    var element = document.getElementById('ovpDashboardLayoutMarker'),
                        iColumnValue = (newCardPosition.column - 1) * this.layoutUtil.getColWidthPx(),
                        pos = {
                            top: (newCardPosition.row - 1) * this.layoutUtil.getRowHeightPx() + this.layoutUtil.CARD_BORDER_PX,
                            left: this.isRTLEnabled ? -iColumnValue - this.layoutUtil.CARD_BORDER_PX : iColumnValue + this.layoutUtil.CARD_BORDER_PX
                        };
                    if (!element) {
                        var oDiv = document.createElement('div');
                        oDiv.id = 'ovpDashboardLayoutMarker';
                        oDiv.position = 'absolute';
                        oDiv.style.height = this.floaterData.height + 'px';
                        oDiv.style.width = this.floaterData.width + 'px';
                        oDiv.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + pos.left + 'px,' + pos.top + 'px, 0px) ';
                        document.getElementsByClassName('sapUshellEasyScanLayoutInner')[0].appendChild(oDiv);
                    } else {
                        element.style[this.layoutUtil.cssVendorTransition] = 'all 300ms ease';
                        element.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + pos.left + 'px,' + pos.top + 'px, 0px) ';
                    }
                    actionObject.element.style[this.layoutUtil.cssVendorTransition] = 'all 300ms ease';
                    actionObject.element.style[this.layoutUtil.cssVendorTransform] = 'translate3d(' + pos.left + 'px,' + pos.top + 'px, 0px) ';
                };
            }
        });
    });