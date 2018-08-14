trigger BeforeTrigger on Delivery_Lines__c (before insert, before update) {
    for(Delivery_Lines__c d : trigger.new){
        d.QTY_Ordered__c = (d.QTY_Ordered__c <> null)? string.valueOf(Integer.valueOf(decimal.valueOf(d.QTY_Ordered__c))):null;
    }
}