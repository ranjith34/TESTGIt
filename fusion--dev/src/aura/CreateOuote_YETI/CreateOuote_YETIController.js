({
    doInit: function(component, event, helper) {

        try {
           
            window.addEventListener("message", function(event) {
                
                 var CustomizerData = event.data;
               if(CustomizerData.includes("isEdit")){
                  console.log("editinit");
                   var edata = JSON.parse(event.data);  
                   var itno = component.get("v.CitemNumber");
                   var evdata = edata.editdata;
                   var v = evdata.toString();
                   var m = v.replace(' "{ ', "{");    
                
                
               
             //  var m = v.replace(new RegExp(escapeRegExp(' }"'), 'g'),  '}');
                
             
               var o = m.replace('"{', '{');
               var  n = o.replace(/\\/g, "");
                
                console.log("n");
                console.log(n);
                
             var jsn =  "[" + n + "]"
                
                let custmizerList = [];
                custmizerList = JSON.parse(jsn);
                var cusList  = component.get("v.Customlist");
                for (var i = 0; i < cusList.length; i++) {
                    if (cusList[i].itemnumber == itno ) {
                        cusList[i].jsondata__r = custmizerList;
                       
                    }
                } 
              component.set("v.Customlist", cusList);
                
                   
                }
                
            else{
                console.log("init");
                console.log(event.data);
               // var v = JSON.stringify(event.data);
               var v = event.data.toString();
                console.log("v");
                console.log(v);
                
                
                  var m = v.replace(' "{ ', "{");    
                
                
               
             //  var m = v.replace(new RegExp(escapeRegExp(' }"'), 'g'),  '}');
                
             
               var o = m.replace('"{', '{');
                 var  n = o.replace(/\\/g, "");
                
                console.log("n");
                console.log(n);
                
             var jsn =  "[" + n + "]"
                
                let custmizerList = [];
                custmizerList = JSON.parse(jsn);
                console.log("hi");
                console.log(custmizerList);
                var StockList = component.get("v.Coolerslist");
                var cusList  = component.get("v.Customlist");
                for (var i = 0; i < StockList.length; i++) {
                    if (StockList[i].Id == component.get("v.customProductId")) {
                        StockList[i].jsondata__r = custmizerList;
                        cusList.push(StockList[i]);
                        StockList.splice(i, 1);
                    }
                }
                console.log(cusList);
                component.set("v.Customlist", cusList);
                component.set("v.Coolerslist", StockList);
                }
            }, false);
        } catch (e) {
            if (e instanceof MyCustomError) {
                // Specific message for MyCustomError
                console.error(e.name + ' (code ' + e.code + '): ' + e.message);
                helper.showToast(component,e.name, "Error", e.message);
            } else {
                // Generic message for other types of error
                // (unreachable code in this sample)
                console.error(e.message);
                helper.showToast(component, "Error", "Error", e.message);
            }
        }


    },




    changeicon: function(component, event, helper) {
        try {
            helper.showsection(component, event);
        } catch (e) {
            console.error(e.message);
            helper.showToast(component, "Error", "Error", e.message);
        }


    },

    changeicon1: function(component, event, helper) {
        try {
            helper.showsectioncustom(component, event);
        } catch (e) {
            console.error(e.message);
            helper.showToast(component, "Error", "Error", e.message);
        }
    },

    changeicon2: function(component, event, helper) {

        try {
            helper.showsectionnoncustom(component, event);
        } catch (e) {
            console.error(e.message);
            helper.showToast(component, "Error", "Error", e.message);
        }

    },
    
   ToggleTopProducts: function(component, event, helper) {

        try {
            helper.showsectionnonTopProducts(component, event);
        } catch (e) {
            console.error(e.message);
            helper.showToast(component, "Error", "Error", e.message);
        }

    },

    handleComponentEvent: function(cmp, event, helper) {
        try {
            helper.recordsFromSearchbar(cmp, event);
        } catch (e) {
            console.error(e.message);
            helper.showToast(cmp, "Error", "Error", e.message);
        }



    },
    handleTopProductevent: function(cmp, event, helper) {
        try {
            helper.recordsFromTopList(cmp, event);
        } catch (e) {
            console.error(e.message);
            helper.showToast(component, "Error", "Error", e.message);
        }

    },

    showAll: function(cmp, event, helper) {
        cmp.set("v.cooler", true);
        cmp.set("v.custom", true);
        cmp.set("v.noncustom", true);
    },

    showCoolers: function(cmp, event, helper) {
        cmp.set("v.cooler", true);
        cmp.set("v.custom", false);
        cmp.set("v.noncustom", false);
    },
    showCustom: function(cmp, event, helper) {
        cmp.set("v.cooler", false);
        cmp.set("v.custom", true);
        cmp.set("v.noncustom", false);
    },
    showNonCustom: function(cmp, event, helper) {
        cmp.set("v.cooler", false);
        cmp.set("v.custom", false);
        cmp.set("v.noncustom", true);
    },

    AddEmblishment: function(component, event, helper) {
        var productkey = event.getSource().get("v.name");
        var n = productkey.lastIndexOf('/');
        var HvItemId = productkey.substring(n + 1);
        var UPK = productkey.substring(0, n);
        component.set("v.customProductId", HvItemId);
        var modalBody;
        $A.createComponent("c:ModalContent", {
                "UPK": UPK
            },
            function(content, status) {
                if (status === "SUCCESS") {
                    modalBody = content;
                    component.find('overlayLib').showCustomModal({
                        header: "ADD EMBELLISHMENT",
                        body: modalBody,
                        showCloseButton: true,
                        cssClass: "slds-modal_large",
                        closeCallback: function() {
                            alert('You closed the alert!');
                        }
                    }).then(function(overlay) {
                        component.set('v.overlay', overlay);
                    });
                }
            });
    },

    saveQuoteHeader: function(component, event, helper) {
        try {
            var issave = true;
            helper.saveandcreate(component, event, helper, issave);
        } catch (e) {
            console.error(e.message);
            helper.showToast(component, "Error", "Error", e.message);
        }


    },

    saveandContinueQuoteDetails: function(component, event, helper) {
        try {
            var issave = false;
            helper.saveandcreate(component, event, helper, issave);
        } catch (e) {
            console.error(e.message);
            helper.showToast(component, "Error", "Error", e.message);
        }

    },
    
    deleteItem :  function(component, event, helper) {
        console.log(event.target.id);
        console.log(event.target.name);
        if(event.target.name == "Custom"){
            console.log("name");
            let customlist = component.get("v.Customlist");
            console.log(customlist)
            for(var i = 0; i < customlist.length; i++){
                
            if(customlist[i].Id == event.target.id ){
                console.log(customlist[i].Id);
                customlist.splice(i, 1);
                component.set("v.Customlist", customlist);
            }  
        } 
        }else {
            let Stock = component.get("v.Coolerslist");
            console.log("list");
            console.log(Stock)
            for(var i = 0; i < Stock.length; i++){
                
            if(Stock[i].Id == event.target.id ){
                console.log(Stock[i].Id);
                Stock.splice(i, 1);
                component.set("v.Coolerslist", Stock);
            }  
        }
            
        }
       
    },
    
    editCustomizer : function(component,event,helper){
        console.log(event.target.name);
        
        let itmnumber = event.target.name;
        component.set("v.CitemNumber",itmnumber);
        var customList = component.get("v.Customlist");
        var json = [];
        var upk;
        for(var i = 0; i < customList.length; i++){
            if(customList[i].itemnumber == itmnumber){
                  upk =  customList[i].UPK__c; 
                for(var j = 0; j < customList[i].jsondata__r.length; j++){
                    if(customList[i].jsondata__r[j].ramsideloc == "front"){
                       json.push(customList[i].jsondata__r[j]); 
                    } 
                }
            }  
        }
        
          var modalBody;
        $A.createComponent("c:ModalContent", {
                "UPK": upk,
                "jsonData":json,
                "isEdit" : "true"
            },
            function(content, status) {
                if (status === "SUCCESS") {
                    modalBody = content;
                    component.find('overlayLib').showCustomModal({
                        header: "ADD EMBELLISHMENT",
                        body: modalBody,
                        showCloseButton: true,
                        cssClass: "slds-modal_large",
                        closeCallback: function() {
                            alert('You closed the alert!');
                        }
                    }).then(function(overlay) {
                        component.set('v.overlay', overlay);
                    });
                }
            });
        
        console.log(json);
    }
})