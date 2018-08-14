trigger BeforeCaseTrigger on Case (before Insert) {
    //CaseNRAOwnerAssignment.updateOwner(trigger.new);
    //CasePriorityKeyOwnerAssignment.UpdateOwner(trigger.new);
    //CaseTempsKeyOwnerAssignment.UpdateOwner(trigger.new);
    for(Case c: trigger.New){
        if(trigger.isInsert || (trigger.isUpdate && c.Description <> trigger.oldmap.get(c.Id).Description)){
            c.shortDescription__c = (c.Description <> null)?(((c.Description).length() > 255)? (c.Description).substring(0,97)+'...' : (c.Description) ):'N/A';
        }
    }
}