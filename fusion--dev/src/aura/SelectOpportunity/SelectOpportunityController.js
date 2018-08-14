({
	 
    doInit : function (cmp,event,helper){
        var action = cmp.get("c.getRelatedOpportunities");
        console.log(cmp.get("v.recordId"));
        action.setParams({
            recId : cmp.get("v.recordId")
        });
        
        console.log("1");
        action.setCallback(this, function(response) {
             var state = response.getState();
               if (state === "SUCCESS") {
                   console.log("2");
                   var results = response.getReturnValue() ;
                   
                console.log(response.getReturnValue());
                   var results = response.getReturnValue();
                   var optionlist = cmp.get("v.options");
                   for(var i = 0; i < results.length; i++){
                       //console.log(results[i].Name);
                       let oppObj = {
                           'label': results[i].Name , 'value': results[i].Id
                       }
                       optionlist.push(oppObj);
                   }
                   cmp.set("v.options",optionlist);
                   console.log(cmp.get("v.options"));
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

    },
    
    handleChange: function (cmp, event) {
        var changeValue = event.getParam("value");
        //alert(changeValue);
         cmp.set("v.value",changeValue);
         console.log(cmp.get("v.value"));
    },
    
    navigatetoQuoteScreen : function(component, event, helper){
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:CreateOuote_YETI",
             componentAttributes: {
                OppId : component.get("v.value"),
                 AccId : component.get("v.recordId")
            }
           
        });
        evt.fire();
        $A.get("e.force:closeQuickAction").fire();
    }
})