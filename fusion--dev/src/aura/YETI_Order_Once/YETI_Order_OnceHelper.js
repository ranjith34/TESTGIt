({
	initialization : function(component) {
        
        var action = component.get("c.Intialization");       
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") { 
				component.set("v.dval",response.getReturnValue());
                component.set("v.ShipToOptions",(component.get("v.dval")).ShipToOptions);
            }else{
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
    },
    saveOpportunity : function(component, stage) {
        
		component.set("v.ConfirmationMsg",'Creating Order, please wait.....');
        var action = component.get("c.saveOpportunity");     
        action.setParams({ 
            "wObj" : JSON.stringify(component.get("v.dval")),
            "stage" : stage
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            //alert(response);
            if(state === "SUCCESS") {  
				component.set("v.ConfirmationMsg",'Thank you for submitting your order!');
                component.set("v.okLabel",'OK');
            }else{
                //alert(response);
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
    },
    getShipToAccount : function(component) {
        
		
        var action = component.get("c.getShipToAccount");     
        action.setParams({ 
            "wObj" : JSON.stringify(component.get("v.dval"))
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {                 
				component.set("v.ShipToOptions",response.getReturnValue());
            }else{
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
    },
    getNewOpportunity : function(component) {
        
		//alert('call');
        var action = component.get("c.getNewOpportunity");     
        action.setParams({ 
            "wObj" : JSON.stringify(component.get("v.dval"))
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") { 
				component.set("v.dval",response.getReturnValue());
                this.saveOpportunity(component,'Trading Post');
            }else{
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
        
    },
    
    removeShipToItem : function(component,pbeid) {
        
        var action = component.get("c.removeShipToItem");     
        action.setParams({ 
            "wObj" : JSON.stringify(component.get("v.dval")),
            "pbeid" : pbeid
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") { 
				component.set("v.dval",response.getReturnValue());
            }else{
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
    },

    validateOrderOnce : function(component, event, helper) {
        let lstAvaiLine = component.get("v.dval.lstAvaiLine");
        let errorLinesMessages = [];
        for(let ind in lstAvaiLine){
            if(lstAvaiLine[ind].ischeck && lstAvaiLine[ind].lineQuantity%lstAvaiLine[ind].MinimumOrderQuantity!==0){
                let er = " "+lstAvaiLine[ind].prd.Description + " should have quantity multiples of " + lstAvaiLine[ind].MinimumOrderQuantity;
                errorLinesMessages.push(er);
            }
        }
        
        if(errorLinesMessages.length>0){
            $A.get("e.force:showToast").setParams({
                "title": "ERROR",
                "message": errorLinesMessages.toString(),
                "type": "error"
            }).fire();
            
            return false;
        }
        else{
            return true;
        }
    },
    
    SaveOrderOnceProduct : function(component) {    
        console.log(JSON.stringify(component.get("v.dval")));
        var action = component.get("c.saveOrderOnce");
        action.setParams({ 
            "wObj" : JSON.stringify(component.get("v.dval"))
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if(state === "SUCCESS") {    
                
				component.set("v.dval",response.getReturnValue());
            }else{
               
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
    },
    findProductEntry : function(component, event) {       
		
		var searchtext = component.find("searchtext").get("v.value");
		var productcategory = "";//component.find("searchcategory").get("v.value");
        
        
		var action = component.get("c.getFilteredProducts");
        action.setParams({ 
            "wObj" : JSON.stringify(component.get("v.dval")),
            "searchText" : searchtext,
			"productCategory" : productcategory
        });
		

        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if(state === "SUCCESS") {    
				component.set("v.dval",response.getReturnValue());
            }else{
               
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
        
    },
    searchOrderOnce : function(component) {       
		
        var action = component.get("c.searchOrderOnce");
        action.setParams({ 
            "wObj" : JSON.stringify(component.get("v.dval"))
        });
		

        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if(state === "SUCCESS") {    
				component.set("v.dval",response.getReturnValue());
                component.set("v.ShipToOptions",(component.get("v.dval")).ShipToOptions);
            }else{
               
                var theErrors = response.getError();
                for(var i = 0; i < theErrors.length; i++) {
					alert(theErrors[i].message);
        		}
            }
        });
        $A.enqueueAction(action);
        
    },
    showPopupHelper: function(component, componentId, className){
        var modal = component.find(componentId);
        $A.util.removeClass(modal, className + 'hide');
        $A.util.addClass(modal, className + 'open');
    },
    hidePopupHelper: function(component, componentId, className){
        var modal = component.find(componentId);
        $A.util.addClass(modal, className+'hide');
        $A.util.removeClass(modal, className+'open');
    },
})