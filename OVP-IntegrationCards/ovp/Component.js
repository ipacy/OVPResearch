(function() {
	"use strict";
	/*global sap, jQuery */

	/**
	 * @fileOverview Application component to display information on entities from the GWSAMPLE_BASIC
	 *   OData service.
	 * @version @version@
	 */
	jQuery.sap.declare("vistex.poc.ovp.ovp.Component");

	jQuery.sap.require("sap.ovp.app.Component");

	sap.ovp.app.Component.extend("vistex.poc.ovp.ovp.Component", {

		metadata: {
			manifest: "json"
		},
		
		init: function() {
			
		},
		
//		setContainer: function () {
//
//            var ovpConfig = this.getOvpConfig();
//            var oFilterModel = this.getModel(ovpConfig.globalFilterModel);
//            // call overwritten setContainer (sets this.oContainer)
//            sap.ui.core.UIComponent.prototype.setContainer.apply(this, arguments);
//            
//           var mParameters = {
//            	    serviceUrl: "ovp/localService/mockdata/metadata.xml/",
//            	    synchronizationMode: "None"
//            	};
//            	oFilterModel = new sap.ui.model.odata.v4.ODataModel(mParameters)
//
//            if (oFilterModel && !this.getAggregation("rootControl")) {
//                Promise.all([
//                    this._checkForAuthorizationForLineItems(ovpConfig)
//                ]).then(function (aResponse) {
//                    this.oOvpConfig = aResponse[0];
//                    // Do the templating once the metamodel is loaded
//                    this.runAsOwner(function () {
//                        var oView = this.createXMLView(this.oOvpConfig);
//                        oView.loaded().then(function(){
//                            this.setAggregation("rootControl", oView);
//                            this.oContainer.invalidate();
//                        }.bind(this));
//                    }.bind(this));
//                }.bind(this));
////                oFilterModel.attachMetadataFailed(function () {
////                    /*To show error page if metadata Model doesn't get loaded*/
////                    this._showErrorPage();
////                }.bind(this));
//            }
//        }, createXMLView: function (ovpConfig) {
//
//            if (this.getRouter()) {
//                this.getRouter().initialize();
//            }
//            var appConfig = this.getMetadata().getManifestEntry("sap.app");
//            var uiConfig = this.getMetadata().getManifestEntry("sap.ui");
////            var sIcon = sap.base.util.ObjectPath.get("icons.icon", uiConfig);
//            var sIcon = "";
//
//            var sComponentName = this.getMetadata().getComponentName();
//            // sComponentNameForURL is created by replacing all the '.' to '/' to support sap.ui.require.toUrl API
//            var sComponentNameForURL = sComponentName.replace(/\./g, "/");
//            ovpConfig.baseUrl = sap.ui.require.toUrl(sComponentNameForURL);
//            if (ovpConfig.smartVariantRequired === undefined || ovpConfig.smartVariantRequired === null) {
//                ovpConfig.smartVariantRequired = true;
//            }
//            if (ovpConfig.enableLiveFilter === undefined || ovpConfig.enableLiveFilter === null) {
//                ovpConfig.enableLiveFilter = true;
//            }
//            if (ovpConfig.showDateInRelativeFormat === undefined || ovpConfig.showDateInRelativeFormat === null) {
//                ovpConfig.showDateInRelativeFormat = true;
//            }
//            if (ovpConfig.useDateRangeType === undefined || ovpConfig.useDateRangeType === null) {
//                ovpConfig.useDateRangeType = false;
//            }
//            if (ovpConfig.bHeaderExpanded === undefined || ovpConfig.bHeaderExpanded === null) {
//                ovpConfig.bHeaderExpanded = false;
//            }
//
//            var oFilterModel = this.getModel(ovpConfig.globalFilterModel);
//            var oFilterMetaModel = oFilterModel && oFilterModel.getMetaModel();
//            this.setModel(oFilterModel);
//
//            //If global filter entity set is provided, then populate entity type using that entity set
//            if (ovpConfig.globalFilterEntitySet && ovpConfig.globalFilterEntitySet !== " ") {
//                var oEntitySet = oFilterMetaModel && oFilterMetaModel.getODataEntitySet(ovpConfig.globalFilterEntitySet);
//                ovpConfig.globalFilterEntityType = oEntitySet && oEntitySet.entityType;
//            }
//
//            //Get fully-qualified and non-qualified entity type name
//            if (ovpConfig.globalFilterEntityType && ovpConfig.globalFilterEntityType !== " " &&
//                ovpConfig.globalFilterEntityType.length > 0) {
//                ovpConfig.globalFilterEntityType = this._getFullyQualifiedNameForEntity(
//                    ovpConfig.globalFilterEntityType, oFilterMetaModel);
//                ovpConfig.globalFilterEntityTypeNQ = ovpConfig.globalFilterEntityType.split(".").pop();
//            }
//            var uiModel = new sap.ui.model.json.JSONModel(ovpConfig);
////            uiModel.setProperty("/applicationId", sap.base.util.ObjectPath.get("id", appConfig));
////            uiModel.setProperty("/title", sap.base.util.ObjectPath.get("title", appConfig));
////            uiModel.setProperty("/description", sap.base.util.ObjectPath.get("description", appConfig));
//
//            if (sIcon) {
//                if (sIcon.indexOf("sap-icon") < 0 && sIcon.charAt(0) !== '/') {
//                    sIcon = ovpConfig.baseUrl + "/" + sIcon;
//                }
//                uiModel.setProperty("/icon", sIcon);
//            }
//
//            //convert cards object into sorted array
//            var oCards = ovpConfig.cards;
//            var aCards = [];
//            var oCard;
//            for (var cardKey in oCards) {
//                if (oCards.hasOwnProperty(cardKey) && oCards[cardKey]) {
//                    oCard = this._mergeKeyUserChanges(oCards[cardKey]);
//                    oCard.id = cardKey;
//                    aCards.push(oCard);
//                }
//            }
//
//            aCards.sort(function (card1, card2) {
//                if (card1.id < card2.id) {
//                    return -1;
//                } else if (card1.id > card2.id) {
//                    return 1;
//                } else {
//                    return 0;
//                }
//            });
//
//            uiModel.setProperty("/cards", aCards);
//            if (this.inResizableTestMode() === true) {
//                ovpConfig.containerLayout = "resizable";
//            }
//
//            // Layout switch: read 'containerLayout' property from manifest
//            if (ovpConfig.containerLayout && ovpConfig.containerLayout === "resizable") {
//                uiModel.setProperty("/cardContainerFragment", "sap.ovp.app.DashboardCardContainer");
//                //Read all the property "/resizableLayout" from the manifest and set it to "/dashboardLayout" property
//                uiModel.setProperty("/dashboardLayout", ovpConfig.resizableLayout);
//                var oDblUtil = new sap.ovp.ui.DashboardLayoutUtil(uiModel);
//                this.setDashboardLayoutUtil(oDblUtil);
//            } else {
//                // default + compatibility --> EasyScanLayout
//                uiModel.setProperty("/cardContainerFragment", this.getCardContainerFragment());
//            }
//
//            this.setModel(uiModel, "ui");
//
//            /* What: Using Resource Bundle to get strings to display on error page. */
//            var ovplibResourceBundle = this._getOvpLibResourceBundle();
//            this.setModel(ovplibResourceBundle, "ovplibResourceBundle");
//            var oEntityType = oFilterMetaModel && oFilterMetaModel.getODataEntityType(ovpConfig.globalFilterEntityType, true);
//            /**
//             * power user
//             * temp
//             */
//            var oView = sap.ui.view("mainView", {
//                height: "100%",
//                preprocessors: {
//                    xml: {
//                        bindingContexts: {
//                            ui: uiModel.createBindingContext("/")
//                        },
//                        models: {
//                            ui: uiModel
//                        }
//                    }
//                },
//                type: "XML",
//                viewName: "sap.ovp.app.Main",
//                async: true
//            });
//            /**
//             * end
//             */
//
//            return oView;
//        }
	});
}());