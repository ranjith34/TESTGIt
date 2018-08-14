({
	onloadpage : function(component, event, helper) {        
        var urlEvent = $A.get("e.force:navigateToURL");
		var RId = component.get("v.recordId");
		var URL;
		if(RId.startsWith('a04'))URL = "/apex/YETI_PrintDetails?id="+RId;//Invoice
		if(RId.startsWith('a01'))URL = "/apex/YETI_PrintDetails?id="+RId;//Deliveries
		if(RId.startsWith('a0B'))URL = "/apex/yeti_printorder?id="+RId;//Order		
       
        urlEvent.setParams({
            "url": URL,
            "isredirect": "true"
        });
        urlEvent.fire();      
    }
})