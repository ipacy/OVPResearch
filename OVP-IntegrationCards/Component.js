sap.ui.define([
        "sap/ui/Device",
        "sap/ui/integration/library",
        "sap/ui/core/UIComponent",
        "sap/f/cards/BaseContent",
        "sap/ui/integration/widgets/Card",
        "sap/f/cards/BindingHelper",
        "sap/base/Log",
        "sap/ovp/ui/DashboardLayoutUtil",
        "sap/ovp/ui/DashboardLayoutRearrange",
        "vistex/poc/ovp/control/ovp/CustomContent"],
    function (Device, library, UIComponent, BaseContent, Card, BindingHelper, Log, DashboardLayoutUtil, Rearrange) {
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

                Rearrange.prototype._resizeMoveHandler = function (actionObject) {
                    if (!Device.system.desktop) {
                        return;
                    }
                    if (actionObject.element) {
                        var cardDetails, cardSizeProperties, ghostWidth, ghostHeight,
                            oCard = this.layoutUtil.dashboardLayoutModel.getCardById(actionObject.element.children[0].id);//this.layoutUtil.getCardId(actionObject.element.id));
                        //If the card is stack card or resizing has been disabled for the card then return
                        if (oCard.template === "sap.ovp.cards.stack" || oCard.settings.stopResizing) {
                            return;
                        }
                        //To calculate the scroll height
                        var viewElement = document.getElementsByClassName("sapFDynamicPageContentWrapper")[0];
                        var viewHeight = viewElement.offsetHeight;
                        var viewRect = viewElement.getBoundingClientRect();
                        if ((actionObject.evt.clientY - viewElement.offsetTop + this.SCROLL_OFFSET) > viewHeight) {
                            viewElement.scrollTop = viewElement.scrollTop + this.SCROLL_OFFSET;
                            this.updatedScrollTop += this.SCROLL_OFFSET;
                        } else if (((actionObject.evt.clientY - viewElement.offsetTop) < viewRect.top + this.SCROLL_OFFSET) && viewElement.scrollTop !== 0) {
                            viewElement.scrollTop = viewElement.scrollTop - this.SCROLL_OFFSET;
                            this.updatedScrollTop -= this.SCROLL_OFFSET;
                        }

                        cardSizeProperties = this.layoutUtil.calculateCardProperties(oCard.id);
                        cardDetails = this._calculateMinimumCardHeight(actionObject);
                        //If the user is doing resizing in -X direction and the card has only 1 column then return
                        if (cardDetails.ghostWidthCursor <= this.layoutUtil.getColWidthPx() && this.uiActions.isResizeX && !this.uiActions.isResizeY) {
                            return;
                        }
                        ghostHeight = cardDetails.ghostHeightCursor;
                        ghostWidth = cardDetails.ghostWidthCursor <= this.layoutUtil.getColWidthPx() ? this.layoutUtil.getColWidthPx() : cardDetails.ghostWidthCursor;
                        if (!this.uiActions.isResizeY) {//If the resize is done only in X-direction
                            //Stop resizing for a Card with single colSpan and if the card has multiple colSpan then user should not resize only case when he is increasing the size
                            if (actionObject.element.classList.contains('sapOvpNotResizableLeftRight') ||
                                (actionObject.element.classList.contains('sapOvpNotResizableRight') && cardDetails.ghostWidthCursor > oCard.dashboardLayout.colSpan * this.layoutUtil.getColWidthPx())) {
                                return;
                            } else {
                                Log.info('Not a valid scenario');
                            }
                            //For list card user can not resize more than two columns
                            if (oCard.template === "sap.ovp.cards.list" && ghostWidth > this.layoutUtil.getColWidthPx() * 2 ||
                                (oCard.template === "sap.ovp.cards.linklist" && oCard.settings.listFlavor === 'carousel' &&
                                    (ghostWidth > this.layoutUtil.getColWidthPx() * 3))) {
                                return;
                            }
                        }
                        //for linklist card carousel flavour its three columns and 45 rows
                        if (oCard.template === "sap.ovp.cards.linklist" && oCard.settings.listFlavor === 'carousel' &&
                            ghostHeight > this.layoutUtil.getRowHeightPx() * 45) {
                            actionObject.element.classList.add('sapOvpNotResizableDown');
                            return;
                        }

                        var leastHeight = cardSizeProperties.leastHeight + 2 * this.layoutUtil.CARD_BORDER_PX;
                        var minCardHeight = cardSizeProperties.minCardHeight + 2 * this.layoutUtil.CARD_BORDER_PX;
                        actionObject.element.classList.remove("sapOvpMinHeightContainer");
                        if (ghostHeight <= leastHeight) {
                            ghostHeight = leastHeight;
                            actionObject.element.classList.add("sapOvpMinHeightContainer");
                            this.resizeData.showOnlyHeader = true;
                        } else if (ghostHeight > leastHeight && ghostHeight <= minCardHeight) {
                            var cutOffPoint = (leastHeight + minCardHeight) / 2;
                            if (ghostHeight > cutOffPoint) {
                                ghostHeight = minCardHeight;
                                this.resizeData.showOnlyHeader = false;
                            } else {
                                ghostHeight = leastHeight;
                                actionObject.element.classList.add("sapOvpMinHeightContainer");
                                this.resizeData.showOnlyHeader = true;
                            }

                        } else {
                            //If the resize is not done in X-direction and card type is list/table then increment the ghost
                            //by line item height Else increase the ghost height by 16px
                            if (!this.uiActions.isResizeX && (oCard.template === 'sap.ovp.cards.list' || oCard.template === 'sap.ovp.cards.table')) {
                                var iContentWithoutHeader = cardSizeProperties.headerHeight + cardSizeProperties.dropDownHeight + 2 * this.layoutUtil.CARD_BORDER_PX;
                                var iPredictedNoOfItems = Math.round((ghostHeight - iContentWithoutHeader) / cardSizeProperties.itemHeight);
                                ghostHeight = iPredictedNoOfItems * cardSizeProperties.itemHeight + iContentWithoutHeader;
                            }
                            this.resizeData.showOnlyHeader = false;
                        }
                        this._addOverLay(cardDetails.cursor);
                        this.resizeData.colSpan = Math.round(ghostWidth / this.layoutUtil.getColWidthPx());
                        this.resizeData.rowSpan = Math.ceil(ghostHeight / this.layoutUtil.getRowHeightPx());
                        this.layoutUtil.updateCardSize(oCard.id, ghostHeight, ghostWidth, this.resizeData.rowSpan);
                        this.showGhostWhileResize(actionObject, oCard);
                        if (this.resizeData.colSpan && this.resizeData.rowSpan) {
                            //get card controller and send resize data
                            this.layoutUtil.resizeCard(actionObject.element.getAttribute("id"), this.resizeData, this.layoutUtil.dragOrResizeChanges);
                        }
                        this.resizeData = {};
                        this.layoutUtil.setKpiNumericContentWidth(actionObject.element);
                    }
                };

                Rearrange.prototype._dragStartHandler = function (evt, cardElement) {

                    //Prevent the browser to mark any elements while dragging
                    if (Device.system.desktop) {
                        jQuery("body").addClass("sapOVPDisableUserSelect sapOVPDisableImageDrag");
                    }
                    //on drag start remove focus from current focused card
                    if (this.layoutUtil && this.layoutUtil.sLastFocusableCard) {
                        jQuery(this.layoutUtil.sLastFocusableCard).blur();
                    }
                    //Array to store position/resizing delta changes
                    this.layoutUtil.dragOrResizeChanges = [];
                    var sCardId = this.layoutUtil.getCardId(cardElement.children[0].id);
                    // var sCardId = this.layoutUtil.getCardId(cardElement.id);
                    var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(sCardId);
                    this.layoutUtil.dragStartCard = {
                        cardId: oCard.id,
                        row: oCard.dashboardLayout.row,
                        column: oCard.dashboardLayout.column,
                        rowSpan: oCard.dashboardLayout.rowSpan,
                        colSpan: oCard.dashboardLayout.colSpan,
                        maxColSpan: oCard.dashboardLayout.maxColSpan,
                        noOfItems: oCard.dashboardLayout.noOfItems,
                        autoSpan: oCard.dashboardLayout.autoSpan,
                        showOnlyHeader: oCard.dashboardLayout.showOnlyHeader
                    };
                    //Prevent selection of text on tiles and groups
                    Log.info(cardElement);
                    if (jQuery(window).getSelection) {
                        var selection = jQuery(window).getSelection();
                        selection.removeAllRanges();
                    }
                    this.initCardsSettings();
                    //store the width and height of the card for ghost size
                    var oCardRect = cardElement.children[0].getBoundingClientRect();
                    this.floaterData = {
                        width: oCardRect.width,
                        height: oCardRect.height,
                        startLeft: oCardRect.left - this.layoutOffset.left,
                        startTop: oCardRect.top - this.layoutOffset.top
                    };
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
                        var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(document.getElementById(this.floaterData.id).children[0].children[0].children[0].id);
                        // var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(this.floaterData.children[0].id);
                        // var oCard = this.layoutUtil.dashboardLayoutModel.getCardById(this.layoutUtil.getCardId(this.floaterData.id));
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
            }
        });
    });
