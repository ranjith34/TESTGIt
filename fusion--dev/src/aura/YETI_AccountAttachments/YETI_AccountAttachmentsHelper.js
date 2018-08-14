({
    getAllAttachments : function(component,event,helper) {
        this.showSpinner(component);
        var action = component.get("c.getAllRelatedAttachments");
        action.setParams({ 
            "accountID" : component.get("v.recordId")       
        });
        action.setCallback(this, function(response) {
            var state = response.getState();            
            if(state === "SUCCESS"){                  
                let returnList=[];
                console.log(response.getReturnValue());
                let allAttachmentes=response.getReturnValue();
                if(allAttachmentes!=undefined && allAttachmentes.length!=0){
                    if(allAttachmentes['Attachment']!==undefined){                      
                        for(let i=0;i<allAttachmentes['Attachment'].length;i++){
                            returnList.push({"Id":allAttachmentes['Attachment'][i]["Id"],
                                             "name":allAttachmentes['Attachment'][i]["Name"],
                                             "relatedToName":allAttachmentes['Attachment'][i].hasOwnProperty("Parent")?allAttachmentes['Attachment'][i]["Parent"].Name:'Task',
                                             "relatedToId":allAttachmentes['Attachment'][i]["ParentId"],
                                             "lastModifiedByName":allAttachmentes['Attachment'][i]["LastModifiedBy"].Name,
                                             "lastModifiedById":allAttachmentes['Attachment'][i]["LastModifiedById"],
                                             "LastModifiedDate":allAttachmentes['Attachment'][i]["LastModifiedDate"],
                                             "CreatedByName":allAttachmentes['Attachment'][i]["CreatedBy"].Name,
                                             "CreatedById":allAttachmentes['Attachment'][i]["CreatedBy"].Id,
                                             "Type":"Attachment",
                                             "formatedDate":this.formatDate(new Date(allAttachmentes['Attachment'][i]["LastModifiedDate"].substring(0,10)))
                                            });
                        }
                    }
                    if(allAttachmentes['File']!=undefined && allAttachmentes['File'].length!=0){
                        for(let i=0;i<allAttachmentes['File'].length;i++){
                            returnList.push({"Id":allAttachmentes['File'][i]["ContentDocumentId"],
                                             "name":allAttachmentes['File'][i]["ContentDocument"].Title+(allAttachmentes['File'][i]["ContentDocument"].FileType!='UNKNOWN'?'.'+allAttachmentes['File'][i]["ContentDocument"].FileType:''),
                                             "relatedToName":allAttachmentes['File'][i]["LinkedEntity"].Name,
                                             "relatedToId":allAttachmentes['File'][i]["LinkedEntityId"],
                                             "lastModifiedByName":allAttachmentes['File'][i]["ContentDocument"].LastModifiedBy.Name,
                                             "lastModifiedById":allAttachmentes['File'][i]["ContentDocument"].LastModifiedById,
                                             "LastModifiedDate":allAttachmentes['File'][i]["ContentDocument"].LastModifiedDate,
                                             "CreatedByName":allAttachmentes['File'][i]["ContentDocument"].CreatedBy.Name,
                                             "CreatedById":allAttachmentes['File'][i]["ContentDocument"].CreatedBy.Id,
                                             "Type":"File",
                                             "formatedDate":this.formatDate(new Date(allAttachmentes['File'][i]["ContentDocument"].LastModifiedDate.substring(0,10)))
                                            });
                        }
                    }                   
                   console.log(returnList);
                    component.set("v.relatedAttachments",returnList);
                    component.set("v.relatedAttachmentsFinalList",returnList);
                    component.set("v.start",0);
                    this.createMapFromList(component,event,helper);
                }               
                this.hideSpinner(component);
            }else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        $A.get("e.force:showToast").setParams({
                            "title": "ERROR",
                            "message": "Error message: " + errors[0].message,
                            "type": "error"
                        }).fire();
                    }
                } else {	
                    
                    $A.get("e.force:showToast").setParams({
                        "title": "ERROR",
                        "message": "Unknown error",
                        "type": "error"
                    }).fire();
                }
            }    
        });
        $A.enqueueAction(action);
    },
    deleteAttachment :function(component,event,helper){
        this.showSpinner(component);
        let recordId=event.target.getAttribute("data-attachmentId");
        var action = component.get("c.deleteRelatedAttachment");
        action.setParams({ 
            "attachmentId" : recordId      
        });
        action.setCallback(this, function(response) {
            var state = response.getState();            
            if(state === "SUCCESS"){
                this.getAllAttachments(component,event,helper);
                this.hideSpinner(component);
            }else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        $A.get("e.force:showToast").setParams({
                            "title": "ERROR",
                            "message": "Error message: " + errors[0].message,
                            "type": "error"
                        }).fire();
                    }
                } else {	                    
                    $A.get("e.force:showToast").setParams({
                        "title": "ERROR",
                        "message": "Unknown error",
                        "type": "error"
                    }).fire();
                }
            }    
        });
        $A.enqueueAction(action);
    },
    hideSpinner :function(component){     
        var cmpTarget = component.find('spinner');
        $A.util.addClass(cmpTarget, 'slds-hide');
    },
    showSpinner :function(component){
        var cmpTarget = component.find('spinner');
        $A.util.removeClass(cmpTarget, 'slds-hide');
        
    },    
    createMapFromList : function(component, event, helper, lastSetOfRecords, lastNumberOfRecords){       
        if(lastSetOfRecords){
            component.set("v.paginationList", component.get("v.relatedAttachments").slice(lastNumberOfRecords));
        }
        else{
            component.set("v.paginationList", component.get("v.relatedAttachments").slice(parseInt(component.get("v.start")),parseInt(component.get("v.pageSize"))+parseInt(component.get("v.start"))));
        }
    },
    formatDate:function(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        
        return  monthNames[monthIndex]+' ' +day + ', ' + year;
    }
})