({
    onloadpage : function(component, event, helper) {        
        helper.getAllAttachments(component,event,helper);
    },
    redirectToParent :function(component,event,helper){
        let parentId=event.target.getAttribute("data-parentid");
        var sObectEvent = $A.get("e.force:navigateToSObject");
        sObectEvent .setParams({
            "recordId": parentId,
            "slideDevName": "related"
        });
        sObectEvent.fire(); 
    },
    deleteAttachment: function(component, event, helper) {
        helper.deleteAttachment(component,event,helper);         
    },
    editAttachment:function(component,event,helper){
        let attachmentId=event.target.getAttribute("data-attachmentId");
        let editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": attachmentId
        });
        editRecordEvent.fire();
    },
    callNext:function(component,event,helper){        
        debugger;
        if(parseInt(component.get("v.start"))+parseInt(component.get("v.pageSize")) < parseInt(component.get("v.relatedAttachments").length)){
            let startFromIndex = component.get("v.start");
            let pageSize = component.get("v.pageSize");
            component.set("v.start", parseInt(startFromIndex)+parseInt(pageSize));
            helper.createMapFromList(component, event, helper);
        }
    },
    callPrevious:function(component,event,helper){
        if(parseInt(component.get("v.start")) > 0){
            let startFromIndex = component.get("v.start");
            let pageSize = component.get("v.pageSize");
            component.set("v.start", parseInt(startFromIndex)-parseInt(pageSize));
            helper.createMapFromList(component, event, helper);
        }
    },
    first:function(component,event,helper){
        component.set("v.start",0);
        helper.createMapFromList(component, event, helper);
    },
    last:function(component,event,helper){
        if(parseInt(component.get("v.start")) >= 0){
            var sObjectsListLength = parseInt(component.get("v.relatedAttachments").length);
            var pageSize = parseInt(component.get("v.pageSize"));
            var result = sObjectsListLength%pageSize;            
            if(result===0){
                component.set("v.start", sObjectsListLength-pageSize);
                helper.createMapFromList(component, event, helper);
            }
            else{
                component.set("v.start", sObjectsListLength-result);
                result = -result;
                helper.createMapFromList(component, event, helper, true, result);
            }
        }
    },
    filterSelection :function(component,event,helper){
        let searchText=component.find("searchInput").get("v.value").toLowerCase();
        component.set("v.relatedAttachments",component.get("v.relatedAttachmentsFinalList"));            
        let pageSize =component.get("v.pageSize");
        let attachmentList = component.get("v.relatedAttachments");
        let paginationList=[];
        let newAttachmentList=[];        
        component.set("v.start",0);        
        if(searchText!='' && searchText!=null ){           
            for(let index in attachmentList){
                let thisRecordStr = JSON.stringify(attachmentList[index]).toLowerCase();                
                if(thisRecordStr.indexOf(searchText.toLowerCase())>-1){  
                    newAttachmentList.push(attachmentList[index])
                }
            }
            component.set("v.relatedAttachments",newAttachmentList);           
            
        }         
            
            helper.createMapFromList(component, event, helper);
        
        
    }
})