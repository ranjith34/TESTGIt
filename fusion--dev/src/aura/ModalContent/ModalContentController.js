({
	afterLoad : function(component, event, helper) {
        if(component.get("v.isEdit")){
            
            var editmessage = {
                UPK :component.get("v.UPK"),
                jsondata : component.get("v.jsonData")
            }
            var message1 = JSON.stringify(editmessage);
            
     var vfWindow = component.find("vfFrame").getElement().contentWindow;
      console.log(vfWindow);	
      vfWindow.postMessage(message1, '*');
            
        }else{  
     
     var message = component.get("v.UPK");
     var vfWindow = component.find("vfFrame").getElement().contentWindow;
      console.log(vfWindow);	
      vfWindow.postMessage(message, '*');
        
        }   
	},
    
    doInit : function(component, event, helper) {
    
    window.addEventListener("message", function(event) {
          console.log('show json');
          console.log(event.data);
          //component.destroy();
        helper.helperMethod(component, event);
//        var popup = window.open(location, '_self', '');
     //   popup.close();
     //   
     
       
     
         } , false);
        
    }
})