({
	doInit : function(component, event, helper) {
		console.log(component.get("v.recordId"));
        var action = component.get("c.getRelatedLineItems");
        action.setParams({
            QuoteId : component.get("v.recordId") 
        });
        
        action.setCallback(this, function(response) {
            var results =  response.getReturnValue();
            
            console.log(results);
            component.set("v.Stock",results);
        });
        
        $A.enqueueAction(action);

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
    showAll: function(cmp, event, helper) {
        cmp.set("v.cooler", true);
        cmp.set("v.custom", true);
        cmp.set("v.noncustom", true);
    },
    
    
})