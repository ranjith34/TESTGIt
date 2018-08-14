({
	cloneQuote : function(component, event, helper) {
        var quoteHeader = component.get("v.simpleRecord"); 
        console.log(quoteHeader.Account__c);
        var modalBody;
        $A.createComponent("c:ClonePopUp", {
            AccountId : quoteHeader.Account__c
        },
           function(content, status) {
               if (status === "SUCCESS") {
                   modalBody = content;
                   component.find('overlayLib').showCustomModal({
                       header: "Please select open Opportunity",
                       body: modalBody, 
                       showCloseButton: true,
                       cssClass: "mymodal",
                       closeCallback: function() {
                           alert('You closed the alert!');
                       }
                   })
               }                               
           });
		
	},
    
    expireQuote : function(component, event, helper) {
        component.set("v.loaded",true);
       var quoteHeaderobj = component.get("v.simpleRecord");
       var action = component.get("c.changeQuoteStatus");
        action.setParams({
            QuoteId : quoteHeaderobj.Id
        })
        action.setCallback(this, function(response) {
             var state = response.getState();
               if (state === "SUCCESS") {
                   if(response.getReturnValue() == "SUCCESS"){ 
                       console.log("status changed");
                       component.set("v.loaded",false);
                       $A.get('e.force:refreshView').fire();
                   }else{
                       console.log(response.getReturnValue());
                   }
            }
            else if (state === "INCOMPLETE") {
               
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
         $A.enqueueAction(action);
    
    }
})