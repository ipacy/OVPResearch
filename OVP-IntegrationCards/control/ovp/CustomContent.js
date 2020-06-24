/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
        "sap/f/library",
        "sap/f/cards/BaseContent"
    ],
    function (library, BaseContent) {
        "use strict";

        var AreaType = library.cards.AreaType;

        var CustomContent = BaseContent.extend("vistex.control.ovp.CustomContent", {
            metadata: {
                aggregations: {
                    viewSwitch: {"type": "sap.ui.core.Control", multiple: true},
                    content: {"type": "sap.ui.core.Control", multiple: false},
                    _filterToolbar: {type: 'sap.m.Toolbar', multiple: false, visibility: 'hidden'},
                }
            },

            init: function () {
                this.setAggregation('_filterToolbar', new sap.m.Toolbar({
                    height: '3rem'
                }).addStyleClass("sapUiSizeCompact ovpFilterBarPadding"));
            },

            renderer: function (oRm, oCardContent) {

                // Add class the simple way. Add renderer hooks only if needed.
                var sClass = "sapFCard";
                var sLibrary = oCardContent.getMetadata().getLibraryName();
                var sName = oCardContent.getMetadata().getName();
                var sType = sName.slice(sLibrary.length + 1, sName.length);
                var sHeight;
                var oCard = oCardContent.getParent();
                sClass += sType;

                oRm.write("<div");
                oRm.writeElementData(oCardContent);
                oRm.addClass(sClass);
                oRm.addClass("sapFCardBaseContent");
                oRm.writeClasses();

                if (oCard && oCard.isA("sap.f.ICard") && oCard.getHeight() === "auto") { // if there is no height specified the default value is "auto"
                    sHeight = BaseContent.getMinHeight(sType, oCardContent.getConfiguration(), oCardContent.getParent() || oCardContent);
                    oRm.addStyle("min-height", sHeight);
                }

                oRm.writeStyles();
                oRm.write(">");

                if (oCardContent.getAggregation("viewSwitch").length) {
                    oRm.renderControl(oCardContent.getAggregation('_filterToolbar'));
                }
                oRm.renderControl(oCardContent.getAggregation("content"));

                oRm.write("</div>");
            }
        });

        CustomContent.getMetadata().forwardAggregation(
            'viewSwitch',
            {
                getter: function () {
                    return this.getAggregation('_filterToolbar');
                },
                aggregation: 'content',
                forwardBinding: true
            }
        );

        return CustomContent;
    }
);