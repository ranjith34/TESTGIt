({


    saveandcreate: function(component, event, helper, issave) {
        component.set("v.loaded", true);
        var listnew = component.get("v.insertList");
        console.log(listnew)
        var Quotedetails = {
            "accountID": component.get("v.AccId"),
            "opportunityId": component.get("v.OppId"),
            "InHandsDate": component.find("inhanddateId").get("v.value"),
            "DoNotShipBefore": component.find("DoNotShipBeforeId").get("v.value")
        }

        var action3 = component.get("c.saveandupdateQuote");
        action3.setParams({
            newList: JSON.stringify(component.get("v.insertList")),
            updateList: JSON.stringify(component.get("v.updatedList")),
            QuoteId: component.get("v.quoteID"),
            QuoteDetails: JSON.stringify(Quotedetails)
        });

        action3.setCallback(this, function(response2) {
            console.log(response2.getReturnValue());
            var state = response2.getState();
            console.log(state);
            if (state === "SUCCESS") {
                var results = response2.getReturnValue();
                if ((results.newListupdated).length > 0) {
                    console.log(results.newListupdated != null);
                    let ResupdatedList = component.get("v.updatedList");
                    for (var i = 0; i < listnew.length; i++) {
                        for (var j = 0; j < (results.newListupdated).length; j++) {
                            if (listnew[i].itemnumber == results.newListupdated[j].Quote_Item_Number__c) {
                                console.log("get inside");
                                listnew[i].headerid = results.quoteId;
                                listnew[i].lineId = results.newListupdated[j].Id;
                                ResupdatedList.push(listnew[i]);
                            }
                        }
                    }
                    console.log("ResupdatedList");
                    console.log(ResupdatedList);
                    let emptylist = [];
                    component.set("v.insertList", emptylist);
                    component.set("v.updatedList", ResupdatedList);
                    console.log('total List');
                    console.log(component.get("v.updatedList"));

                    console.log(component.get("v.insertList"));
                    component.set("v.quoteID", results.quoteId);
                    console.log(component.get("v.quoteID"));
                }
                console.log(results);
                component.set("v.loaded", false);
                if (issave) {
                    this.showToast(component, "Success!", "success", "Transaction Successfully Saved.");
                    this.navigatetoobject(component, event, component.get("v.quoteID"));
                     $A.get("e.force:refreshView").fire();

                } else {
                    this.showToast(component, "Success!", "success", "The record has been updated successfully.");
                }

            } else if (status === "INCOMPLETE") {
                //console.log("No response from server or client is offline.");
                this.showToast(component, "Error", "Error", "Incomplete Transaction Try again.");
                // Show offline error
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        // console.log("Error message: " + errors[0].message);
                        this.showToast(component, "Error", "Error", errors[0].message);
                    }
                } else {
                    //console.log("Unknown error");
                    this.showToast(component, "Error", "Error", "Unknown error Occurred Try After SomeTime.");
                }

            }
        });
        $A.enqueueAction(action3);
    },

    showToast: function(component, title, type, message) {
        try {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": title,
                "type": type,
                "message": message

            });
            toastEvent.fire();
        } catch (Err) {
            console.log(Err);
        }
    },

    navigatetoobject: function(cmp, event, objectid) {
        try {
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": objectid,
               
            });
            navEvt.fire();
        } catch (Err) {
            console.log(Err);
        }
    },

    showsection: function(component, event) {
        var tar = event.getSource();
        var section = component.find('sectionId');
        var content = component.find('accordion-details-01');
        if (tar.get("v.iconName") == "utility:down") {
            var tart = tar.set("v.iconName", 'utility:right');
            $A.util.removeClass(section, 'slds-is-open');
            content.set("v.aria-hidden", "false");
        } else {
            tar.set("v.iconName", 'utility:down');
            $A.util.addClass(section, 'slds-is-open');
            content.set("v.aria-hidden", "true");
        }
    },

    showsectioncustom: function(component, event) {
        var tar1 = event.getSource();
        var section2 = component.find('section2Id');
        var content2 = component.find('accordion-details-02');
        if (tar1.get("v.iconName") == "utility:down") {
            var tart1 = tar1.set("v.iconName", 'utility:right');
            $A.util.removeClass(section2, 'slds-is-open');
            content2.set("v.aria-hidden", "false");
        } else {
            tar1.set("v.iconName", 'utility:down');
            $A.util.addClass(section2, 'slds-is-open');
            content2.set("v.aria-hidden", "true");
        }
    },

    showsectionnoncustom: function(component, event) {
        var tar2 = event.getSource();
        var section3 = component.find('section3Id');
        var content3 = component.find('accordion-details-03');
        if (tar2.get("v.iconName") == "utility:down") {
            var tart2 = tar2.set("v.iconName", 'utility:right');
            $A.util.removeClass(section3, 'slds-is-open');
            content3.set("v.aria-hidden", "false");
        } else {
            tar2.set("v.iconName", 'utility:down');
            $A.util.addClass(section3, 'slds-is-open');
            content3.set("v.aria-hidden", "true");
        }
    },
    
      showsectionnonTopProducts: function(component, event) {
        var tar3 = event.getSource();
        var section4 = component.find('TopProductsId');
        var content4 = component.find('accordion-Top-Products');
        if (tar3.get("v.iconName") == "utility:down") {
            var tart3 = tar3.set("v.iconName", 'utility:right');
            $A.util.removeClass(section4, 'slds-is-open');
            section4.set("v.aria-hidden", "false");
        } else {
            tar3.set("v.iconName", 'utility:down');
            $A.util.addClass(section4, 'slds-is-open');
            section4.set("v.aria-hidden", "true");
        }
    },

    recordsFromSearchbar: function(cmp, event) {

        var lineobj = event.getParam("lineitems");
        console.log('test1-->' + lineobj);
        var num = parseInt('00010');
        var itmnum = cmp.get("v.itemnumber") + num;
        var lstinsert = cmp.get("v.insertList");
        if ((lineobj.UPK__c != "") && (lineobj.UPK__c != null)) {
            lineobj.itemnumber = itmnum.toString();
            //console.log(itmnum);
            let customlist = cmp.get("v.Coolerslist");
            customlist.push(lineobj);
            cmp.set("v.Coolerslist", customlist);


            lstinsert.push(lineobj);
            cmp.set("v.insertList", lstinsert);

           // console.log(cmp.get("v.Customlist"));
           console.log(cmp.get("v.insertList"));
            cmp.set("v.itemnumber", itmnum);
        } else {
            lineobj.itemnumber = itmnum.toString();
            let noncustom = cmp.get("v.NotCustomlist");
            noncustom.push(lineobj);
            cmp.set("v.NotCustomlist", noncustom);

            let lstinsert = cmp.get("v.insertList");
            lstinsert.push(lineobj);
            cmp.set("v.insertList", lstinsert);

            console.log(cmp.get("v.insertList"));
            cmp.set("v.itemnumber", itmnum);
        }
        //console.log(cmp.get("v.NotCustomlist"));

    },

    recordsFromTopList: function(cmp, event) {
        var prodId = event.getParam("productId");
        //console.log('Name-->' + prodId.ProductName__c + 'URL-->' + prodId.ProductURL__c + 'Id-->' + prodId.Id + 'Description__c');
        var num1 = parseInt('00010');
        var itmnum1 = cmp.get("v.itemnumber") + num1;

        if ((prodId.UPK__c != "") && (prodId.UPK__c != null)) {
            let lineobj1 = {
                "itemnumber": itmnum1.toString(),
                "Description": prodId.Description__c,
                "Name": prodId.ProductName__c,
                "ProductLocation__c": prodId.ProductURL__c
            }

            let customlist1 = cmp.get("v.Coolerslist");
            customlist1.push(lineobj1);
            cmp.set("v.Coolerslist", customlist1);
            var insertlst = cmp.get("v.insertList");
            insertlst.push(lineobj1);
            cmp.set("v.insertList", insertlst);
            cmp.set("v.itemnumber", itmnum1);
        } else {
            let lineobj1 = {
                "itemnumber": itmnum1.toString(),
                "Description": prodId.Description__c,
                "Name": prodId.ProductName__c,
                "ProductLocation__c": prodId.ProductURL__c
            }
            let noncustom1 = cmp.get("v.Coolerslist");
            noncustom1.push(lineobj1);
            cmp.set("v.Coolerslist", noncustom1);
            var insertlst1 = cmp.get("v.insertList");
            insertlst1.push(lineobj1);
            cmp.set("v.insertList", insertlst1);
console.log(cmp.get("v.insertList"));
            cmp.set("v.itemnumber", itmnum1);
        }
        //console.log(cmp.get("v.NotCustomlist"));
    },


})