sap.ui.define([
    "sap/ui/core/ComponentContainer",
    "sap/ui/Device",
    "vistex/poc/ovp/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ovp/ui/DashboardLayoutUtil"
], function (ComponentContainer, Device, Controller, Filter, FilterOperator, JSONModel, DashboardLayoutUtil) {
    "use strict";

    return Controller.extend("vistex.poc.ovp.controller.DashboardLayout", {

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("dashboardLayout").attachPatternMatched(this._onRouteMatched, this);
            var that = this;
            var cardManifests = new sap.ui.model.json.JSONModel();
            this.getView().setModel(cardManifests, "data");


            var dPage = {
                "Type": "sap.f.DynamicPage",
                "class": "ovpApplication",
                "content": [
                    {
                        "Type": "sap.ovp.ui.OVPWrapper",
                        "DynamicPage": {
                            "Type": "vistex.control.ovp.OVPDashboardLayout",
                            "dragAndDropEnabled": true,
                            "class": "sapOvpDashboardLayoutItem",
                            "cards": [
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{data>/cards/custom2/title}",
                                    "subTitle": "{data>/cards/custom2/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{data>/cards/custom2/counter}",
                                    "manifest": "{data>/cards/custom1/data}",
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{data>/cards/custom2/title}",
                                    "subTitle": "{data>/cards/custom2/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{data>/cards/custom2/counter}",
                                    "manifest": "{data>/cards/custom1/data}",
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{data>/cards/custom2/title}",
                                    "subTitle": "{data>/cards/custom2/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{data>/cards/custom2/counter}",
                                    "manifest": "{data>/cards/custom1/data}",
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{data>/cards/custom2/title}",
                                    "subTitle": "{data>/cards/custom2/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{data>/cards/custom2/counter}",
                                    "manifest": "{data>/cards/custom1/data}",
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{data>/cards/custom2/title}",
                                    "subTitle": "{data>/cards/custom2/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{data>/cards/custom2/counter}",
                                    "manifest": "{data>/cards/custom1/data}",
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{data>/cards/custom2/title}",
                                    "subTitle": "{data>/cards/custom2/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{data>/cards/custom2/counter}",
                                    "manifest": "{data>/cards/custom1/data}",
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{widgetModel>/title}",
                                    "subTitle": "{widgetModel>/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{widgetModel>/counter}",
                                    "viewSwitch": {
                                        "Type": "sap.m.Select",
                                        "selectedKey": "{widgetModel>/selectedKey}",
                                        "icon": "{widgetModel>/icon}",
                                        "type": "{widgetModel>/type}",
                                        "items": {
                                            "path": "widgetModel>/Countries",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.ui.core.Item",
                                                "key": "{widgetModel>countryKey}",
                                                "text": "{widgetModel>countryText}",
                                                "enabled": "{widgetModel>enabled}"
                                            }
                                        }
                                    },
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{widgetModel>/title}",
                                    "subTitle": "{widgetModel>/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{widgetModel>/counter}",
                                    "viewSwitch": {
                                        "Type": "sap.m.Select",
                                        "selectedKey": "{widgetModel>/selectedKey}",
                                        "icon": "{widgetModel>/icon}",
                                        "type": "{widgetModel>/type}",
                                        "items": {
                                            "path": "widgetModel>/Countries",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.ui.core.Item",
                                                "key": "{widgetModel>countryKey}",
                                                "text": "{widgetModel>countryText}",
                                                "enabled": "{widgetModel>enabled}"
                                            }
                                        }
                                    },
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                                {
                                    "Type": "vistex.control.ovp.IntegrationCard",
                                    "title": "{widgetModel>/title}",
                                    "subTitle": "{widgetModel>/subTitle}",
                                    "header": {
                                        "Type": "sap.f.cards.Header",
                                        "press": "consoleLog",
                                        "class": "vistexOvpCardTitle",
                                        "title": "{widgetModel>/title}",
                                        "subtitle": "{widgetModel>/subTitle}",
                                        "statusText": "{widgetModel>/counter}"
                                    },
                                    "counter": "{widgetModel>/counter}",
                                    "viewSwitch": {
                                        "Type": "sap.m.Select",
                                        "selectedKey": "{widgetModel>/selectedKey}",
                                        "icon": "{widgetModel>/icon}",
                                        "type": "{widgetModel>/type}",
                                        "items": {
                                            "path": "widgetModel>/Countries",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.ui.core.Item",
                                                "key": "{widgetModel>countryKey}",
                                                "text": "{widgetModel>countryText}",
                                                "enabled": "{widgetModel>enabled}"
                                            }
                                        }
                                    },
                                    "content": {
                                        "Type": "sap.m.List",
                                        "showSeparators": "Inner",
                                        "items": {
                                            "path": "data>/cards/custom2/data",
                                            "templateShareable": false,
                                            "template": {
                                                "Type": "sap.m.StandardListItem",
                                                "title": "{data>name}"
                                            }
                                        }
                                    }
                                },
                            ]
                        }
                    }
                ]
            };
            var jPage = JSON.stringify(dPage);

              sap.ui.view({
                  async: true,
                  type: sap.ui.core.mvc.ViewType.JSON,
                  id: "uxView",
                  height: "40rem",
                  viewContent: {
                      "Type": "sap.ui.core.mvc.JSONView",
                      "content": [dPage]
                  }
              }).loaded().then(function (oView) {
                  that.getView().byId('idFlexPage').addContent(oView);
              });
            /*var displayObj = sap.ui.base.ManagedObject.create(dPage);
            this.getView().byId('idFlexPage').addContent(displayObj);*/

        },

        _onRouteMatched: function () {
            this.loadData();
        },

        loadData: function () {
            this.getView().getModel("data").loadData("models/cardManifest.json");
        },

        onAction: function (oEvent) {
            console.log(oEvent)
        }
    });

});
