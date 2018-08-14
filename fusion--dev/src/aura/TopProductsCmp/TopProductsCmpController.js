({
    doInit : function(component, event, helper)
    {
       var gettopProductsData = component.get("c.getTopProducts");
        gettopProductsData.setCallback(this, function(topProductsResponse) {
            var topProductsstate = topProductsResponse.getState();
            if (topProductsstate === "SUCCESS") {
                var topProductsResponseData = topProductsResponse.getReturnValue();
            component.set("v.topProducts",topProductsResponseData);
            }
            
    });
        $A.enqueueAction(gettopProductsData);
                                       },
    register : function(component, event, helper) {
        
        var event = event.getSource();
        var eventId = event.get("v.name");
        var cmpEvent = component.getEvent("selectedProductEvt");
        cmpEvent.setParams({
            "productId" : eventId  });
        cmpEvent.fire();
    },
  display : function(component, event, helper) {
    //helper.toggleHelper(component, event);
   	var source = (event.target || event.srcElement);
    console.log(source.Id);
        //var eventId = events.dataset.record;
        //console.log('onchange event'+events);
   /* var toggleText = component.find("tooltip");
     //$A.util.toggleClass(toggleText, "toggle"); 
    $A.util.removeClass(toggleText, 'toggle');
    $A.util.addClass(toggleText, 'disOnHover');
      console.log('t2');*/
  },

  displayOut : function(component, event, helper) {
   //helper.toggleHelperRemove(component, event);
   var toggleText1 = component.find("tooltip");
   //$A.util.toggleClass(toggleText1, "toggle");   
  	$A.util.removeClass(toggleText1, 'disOnHover');
    $A.util.addClass(toggleText1, 'toggle');
      console.log('t3');
  },
        toggle : function(component, event, helper) {
        var toggleText2 = component.find("tooltip");
        $A.util.toggleClass(toggleText2, 'slds-show');
    }
})