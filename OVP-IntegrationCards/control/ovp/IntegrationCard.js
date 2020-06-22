/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/f/cards/BaseContent",
    "sap/ui/integration/widgets/Card",
    "sap/f/CardRenderer"
], function (
    BaseContent,
    Card,
    CardRenderer
) {
    "use strict";
    /* global Map */

    var IntegrationCard = Card.extend("vistex.poc.ovp.control.ovp.IntegrationCard", /** @lends sap.ui.integration.widgets.Card.prototype */ {
        metadata: {
            properties: {
                layoutConfig: {
                    type: "object"
                },
                title: {
                    type: "string"
                },
                subTitle: {
                    type: "string"
                },
                counter: {
                    type: "string"
                }
            },
            defaultAggregation: "content",
            aggregations: {
                viewSwitch: { "type": "sap.ui.core.Control", multiple: false},
                content: { type: "sap.ui.core.Control", multiple: false}
            }
        },

        renderer: CardRenderer
    });

    IntegrationCard.prototype._applyHeaderManifestSettings = function () {
        var oManifestHeader = {
            "title": this.getTitle(),
            "subTitle": this.getSubTitle(),
            "status": {
                "text": this.getCounter()
            }
        };

        var oHeader,
            oPreviousHeader,
            oActionsToolbar;

        if (!oManifestHeader) {
            this.fireEvent("_headerReady");
            return;
        }

        oHeader = this._createHeader(oManifestHeader);

        oActionsToolbar = this._createActionsToolbar();
        if (oActionsToolbar) {
            oHeader.setToolbar(oActionsToolbar);
        }

        oPreviousHeader = this.getAggregation("_header");

        if (oPreviousHeader) {
            oPreviousHeader.destroy();
        }

        this.setAggregation("_header", oHeader);

        if (oHeader.isReady()) {
            this.fireEvent("_headerReady");
        } else {
            oHeader.attachEvent("_ready", function () {
                this.fireEvent("_headerReady");
            }.bind(this));
        }
    };

    var MANIFEST_PATHS = {
        TYPE: "/sap.card/type",
        DATA: "/sap.card/data",
        HEADER: "/sap.card/header",
        HEADER_POSITION: "/sap.card/headerPosition",
        CONTENT: "/sap.card/content",
        SERVICES: "/sap.ui5/services",
        APP_TYPE: "/sap.app/type",
        PARAMS: "/sap.card/configuration/parameters"
    };

    IntegrationCard.prototype._applyContentManifestSettings = function () {
        var sCardType = "CustomIntegrationCard";
        var oManifestContent = {};

        var bIsComponent = sCardType && sCardType.toLowerCase() === "component",
            bHasContent = !!oManifestContent,
            sAriaText = sCardType + " " + this._oRb.getText("ARIA_ROLEDESCRIPTION_CARD");

        this._ariaText.setText(sAriaText);

        if (bHasContent && !sCardType) {
            Log.error("Card type property is mandatory!");
            this.fireEvent("_contentReady");
            return;
        }

        if (!bHasContent && !bIsComponent) {
            this._endBusyState("applyManifest");
            this.fireEvent("_contentReady");
            return;
        }

        if (!oManifestContent && bIsComponent) {
            oManifestContent = this._oCardManifest.getJson();
        }

        this._setTemporaryContent();

        BaseContent
            .create(sCardType, oManifestContent, this._oServiceManager, this._oDataProviderFactory, this._sAppId, this)
            .then(function (oContent) {
                this._setCardContent(oContent);
            }.bind(this))
            .catch(function (sError) {
                this._handleError(sError);
            }.bind(this))
            .finally(function () {
                this._endBusyState("applyManifest");
            }.bind(this));
    };

    return IntegrationCard;
});
