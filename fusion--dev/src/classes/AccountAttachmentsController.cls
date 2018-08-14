public class AccountAttachmentsController {
    
    @AuraEnabled
    public static map<string,list<sObject>> getAllRelatedAttachments(string accountID){
        set<id> parentIDs=new set<id>();
        map<string,list<sObject>> mpAttachment=new map<string,list<sObject>>();
        try{
            
            Account objAccount=[select id,(select id from contacts),(select id from Orders),(select id from Cases),(select id from ActivityHistories ORDER BY ActivityDate DESC , LastModifiedDate DESC  LIMIT 500),(select id from OpenActivities ORDER BY ActivityDate ASC , LastModifiedDate DESC  LIMIT 500),(select id from Opportunities)
                                ,(select id from Deliveries__r),(select id from Invoices__r)   
                                from Account where id=:accountID];
            
            
            if(objAccount!=null){                   
                parentIDs.add(objAccount.id);
                
                for(contact objContact: objAccount.contacts){
                    parentIDs.add(objContact.Id);
                }
                
                for(Case objCase: objAccount.Cases){
                    parentIDs.add(objCase.Id);
                }
                
                for(Order objOrder: objAccount.Orders){
                    parentIDs.add(objOrder.Id);
                }
                
                for(Opportunity objOpportunity: objAccount.Opportunities){
                    parentIDs.add(objOpportunity.Id);
                }
                
                for(ActivityHistory objTask: objAccount.ActivityHistories){
                    
                    parentIDs.add(objTask.Id);
                }
                
                for(OpenActivity objTask: objAccount.OpenActivities){
                    
                    parentIDs.add(objTask.Id);
                }
                
                for(Deliveries__c objDelivery: objAccount.Deliveries__r){
                    parentIDs.add(objDelivery.Id);
                }
                
                for(Invoice__c objInvoice: objAccount.Invoices__r){
                    parentIDs.add(objInvoice.Id);
                }
                
            }
            
            if(parentIDs.size()>0){
                system.debug('ParentIDS'+parentIDs);
                
                mpAttachment.put('Attachment',new list<attachment>([select id,Name,Body,BodyLength,ContentType,Description,
                                                                    ParentId,Parent.Name,CreatedDate,LastModifiedDate,
                                                                    LastModifiedById,LastModifiedBy.Name,CreatedById,CreatedBy.Name from attachment where ParentId in:parentIDs]));
                mpAttachment.put('File',new list<ContentDocumentLink>([SELECT ContentDocumentId,LinkedEntityId,LinkedEntity.Name,ContentDocument.ContentAssetId,
                                                                       ContentDocument.Title,ContentDocument.Description,
                                                                       ContentDocument.FileType,
                                                                       ContentDocument.CreatedDate,
                                                                       ContentDocument.LastModifiedDate,
                                                                       ContentDocument.LastModifiedBy.Name,
                                                                       ContentDocument.LastModifiedById,ContentDocument.CreatedById,ContentDocument.CreatedBy.Name   FROM ContentDocumentLink WHERE LinkedEntityId in :parentIDs]));
                
            }
            
        }catch(Exception ex){
            throw new AuraHandledException('Error occurred: ' + ex.getMessage());             
        }
        system.debug(mpAttachment.size());
        return mpAttachment;
    }
    
    @AuraEnabled
    public static void deleteRelatedAttachment(id attachmentId){        
        try{
            String objectName = attachmentId.getSObjectType().getDescribe().getName();            
            list<sObject> deleteList=database.query('select id from '+objectName+' where id=:attachmentId'); 
            delete deleteList;
        }
        catch(Exception ex){
            throw new AuraHandledException('Error occurred: ' + ex.getMessage());             
        }
    }
    
}