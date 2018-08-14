({
	doInit : function(component, event, helper) {
		console.log(component.get("v.AccountId"));
        
        var action = component.get("c.getRelatedOpportunities");
        action.setParams({
            recId : component.get("v.AccountId")
        });
        
        console.log("1");
        action.setCallback(this, function(response) {
             var state = response.getState();
               if (state === "SUCCESS") {
                   console.log("2");
                   var results = response.getReturnValue() ;
                   
                console.log(response.getReturnValue());
                   var results = response.getReturnValue();
                   component.set("v.OppData",results);
                   console.log(component.get("v.OppData"));
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
    
    onCheckboxChange : function(component, event, helper) {
        //Gets the checkbox group based on the checkbox id
		var availableCheckboxes = component.find('r0ID');
        var resetCheckboxValue  = false;
        if (Array.isArray(availableCheckboxes)) {
            //If more than one checkbox available then individually resets each checkbox
            availableCheckboxes.forEach(function(checkbox) {
                checkbox.set('v.value', resetCheckboxValue);
            }); 
        } else {
            //if only one checkbox available then it will be unchecked
            availableCheckboxes.set('v.value', resetCheckboxValue);
        }
        //mark the current checkbox selection as checked
        event.getSource().set("v.value",true);
	}
    
})