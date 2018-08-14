@isTest
public class BeforeTriggerDeliveryLine{
    @isTest static void DeliveryLineTest() {
        Account Acc  = new Account(Name = 'test');
        insert Acc;
    
        Deliveries__c deli = new Deliveries__c(Name ='del 1',Ship_To__c = Acc.id);
        insert deli;
        
        Delivery_Lines__c delLines = new Delivery_Lines__c(Name ='delline1',Deliveries__c = deli.id, QTY_Ordered__c  ='10.00');
        insert delLines;
        
        delLines = [select Id,QTY_Ordered__c from Delivery_Lines__c where Id=:delLines.Id ];
        system.assertEquals(delLines.QTY_Ordered__c,'10');
    }  
}