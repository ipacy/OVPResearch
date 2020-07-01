/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/f/cards/BaseContent",
    "sap/ui/integration/widgets/Card",
    "sap/f/CardRenderer",
    "sap/f/library",
    "sap/ui/integration/library"
], function (
    BaseContent,
    Card,
    CardRenderer,
    fLibrary,
    library
) {
    "use strict";
    /* global Map */

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

    var HeaderPosition = fLibrary.cards.HeaderPosition;

    var AreaType = fLibrary.cards.AreaType;

    var CardDataMode = library.CardDataMode;

    var IntegrationCard = Card.extend("vistex.control.ovp.IntegrationCard", /** @lends sap.ui.integration.widgets.Card.prototype */ {
        metadata: {
            properties: {
                layoutConfig: {type: "object"},

                title: {type: "string"},

                subTitle: {type: "string"},

                counter: {type: "string"},

                colSpan: {type: "int"},

                headerActive: {type: "boolean", defaultValue: true},

                cardHeaderType: {type: "string", defaultValue: "Normal"},

                analyticalHeaderUnitOfMeasurement: {"type": "string", group: "Data"},

                analyticalHeaderNumber: {"type": "string", group: "Data"},

                analyticalHeaderScale: {"type": "string", group: "Data"},

                analyticalHeaderTrend: {"type": "sap.m.DeviationIndicator", group: "Appearance", defaultValue: "None"},

                analyticalHeaderState: {"type": "sap.m.ValueColor", group: "Appearance", defaultValue: "Neutral"},

                analyticalHeaderDetails: {"type": "string", group: "Appearance"},

                analyticalHeaderKPITargetTitle: {"type": "string", group: "Appearance"},

                analyticalHeaderKPITargetNumber: {"type": "string", group: "Appearance"},

                analyticalHeaderKPITargetUnit: {"type": "string", group: "Appearance"},

                analyticalHeaderKPIDeviationTitle: {"type": "string", group: "Appearance"},

                analyticalHeaderKPIDeviationNumber: {"type": "string", group: "Appearance"},

                analyticalHeaderKPIDeviationUnit: {"type": "string", group: "Appearance"}
            },
            defaultAggregation: "content",
            aggregations: {
                viewSwitch: {"type": "sap.ui.core.Control", multiple: false},
                content: {type: "sap.ui.core.Control", multiple: false}
            }
        },
        renderer: CardRenderer
    });

    IntegrationCard.prototype.init = function () {
        Card.prototype.init.apply(this, arguments);
        this.addStyleClass("sapOvpBaseCard");
        this.setManifest({});
    };

    IntegrationCard.prototype._applyHeaderManifestSettings = function () {
        var oManifestHeader = {
            title: this.getTitle(),
            subTitle: this.getSubTitle(),
            status: {
                text: this.getCounter()
            }
        };

        if (this.getHeaderActive()) {
            oManifestHeader['actions'] = [
                {
                    type: 'Custom',
                    parameters: {
                        url: '#'
                    }
                }
            ];
        }

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

        IntegrationCard
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

    IntegrationCard.create = function (sType, oConfiguration, oServiceManager, oDataProviderFactory, sAppId, oCard) {
        return new Promise(function (resolve, reject) {
            var oCardContent = oCard.getContent() ? oCard.getContent().clone() : null;

            var oContent = new vistex.control.ovp.CustomContent({
                viewSwitch: oCard.getViewSwitch() ? oCard.getViewSwitch().clone() : null,
                content: oCardContent
            });

            //Setting the Models
            if (oCard.getContent() || oCard.getViewSwitch()) {
                var oModels = {};
                if (oCard.getContent()) {
                    oModels = oCard.getContent().oPropagatedProperties.oModels;
                } else {
                    oModels = oCard.getViewSwitch().oPropagatedProperties.oModels;
                }
                for (var key in oModels) {
                    oContent.setModel(oModels[key], key);
                }
            }

            oContent._sAppId = sAppId;
            oContent.setServiceManager(oServiceManager);
            oContent.setDataProviderFactory(oDataProviderFactory);

            oContent.setConfiguration(oConfiguration);

            resolve(oContent);
        });
    };

    IntegrationCard.prototype.setShowHeader = function (vValue) {
        this.setProperty("title", vValue);
        this._bApplyManifest = true;
        return this;
    };

    IntegrationCard.prototype.setSubTitle = function (vValue) {
        this.setProperty("subTitle", vValue);
        this._bApplyManifest = true;
        return this;
    };

    IntegrationCard.prototype.setCounter = function (vValue) {
        this.setProperty("counter", vValue);
        this._bApplyManifest = true;
        return this;
    };

    IntegrationCard.prototype._createHeader = function (mConfiguration) {
        if (this.getCardHeaderType() === "Numeric") {
            mConfiguration.type = "Numeric";
            mConfiguration.unitOfMeasurement = this.getAnalyticalHeaderUnitOfMeasurement();
            mConfiguration.details = this.getAnalyticalHeaderDetails();

            mConfiguration.mainIndicator = {
                number: this.getAnalyticalHeaderNumber(),
                unit: this.getAnalyticalHeaderScale(),
                trend: this.getAnalyticalHeaderTrend(),
                state: this.getAnalyticalHeaderState()
            };

            mConfiguration.sideIndicators = [];
            if (this.getAnalyticalHeaderKPITargetTitle() || this.getAnalyticalHeaderKPITargetNumber() || this.getAnalyticalHeaderKPITargetUnit()) {
                mConfiguration.sideIndicators.push({
                    title: this.getAnalyticalHeaderKPITargetTitle(),
                    number: this.getAnalyticalHeaderKPITargetNumber(),
                    unit: this.getAnalyticalHeaderKPITargetUnit()
                });
            }

            if (this.getAnalyticalHeaderKPITargetTitle() || this.getAnalyticalHeaderKPITargetNumber() || this.getAnalyticalHeaderKPITargetUnit()) {
                mConfiguration.sideIndicators.push({
                    title: this.getAnalyticalHeaderKPIDeviationTitle(),
                    number: this.getAnalyticalHeaderKPIDeviationNumber(),
                    unit: this.getAnalyticalHeaderKPIDeviationUnit()
                });
            }
        }

        return Card.prototype._createHeader.apply(this, arguments);
    };

    return IntegrationCard;
});