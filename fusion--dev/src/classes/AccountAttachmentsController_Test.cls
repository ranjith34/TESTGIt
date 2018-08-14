@isTest(seeAllData=false)
public class AccountAttachmentsController_Test  {
    @testSetup
    public static void createData(){
        
        Account acc=new Account(Name='Testing Account');
        insert acc; 
        
        Account acc2=new Account(Name='Testing Account Negative Case');
        insert acc2; 
        
        Product2 p = new Product2();
        p.Name = ' Test Product ';
        p.Description='Test Product Entry 1';
        p.productCode = 'ABC';
        p.isActive = true;
        insert p;
        
        PricebookEntry standardPrice = new PricebookEntry();        
        standardPrice.Pricebook2Id = Test.getStandardPricebookId();
        standardPrice.Product2Id = p.Id;
        standardPrice.UnitPrice = 1;
        standardPrice.IsActive = true;
        standardPrice.UseStandardPrice = false;
        insert standardPrice ;
        
        
        //Test Order Insert
        
        Order o = new Order();
        o.Name = 'Test Order ';
        o.Status = 'Draft';
        o.EffectiveDate = system.today();
        o.EndDate = system.today() + 4;
        o.AccountId = acc.id;
        o.Pricebook2Id =  Test.getStandardPricebookId();        
        insert o;
        
        Contact con=new Contact(lastname='testing contact',AccountId=acc.Id);
        insert con; 
        
        Case caseObj=new Case(
            AccountId = acc.Id,
            ContactId = con.Id,            
            Origin='My Origin',
            Status='My Status'            
        );
        insert caseObj;
        
        Opportunity testOpportunity = new Opportunity(
            StageName = 'Sourcing Demand',
            CloseDate = system.today().addDays(20),
            AccountId = Acc.Id,
            Name = 'Test Opportunity Triggers'
        );
        insert testOpportunity;
        task openTask=   new Task(
            ActivityDate = Date.today().addDays(7),
            Subject='Sample Task',
            WhatId = acc.Id,
            OwnerId = UserInfo.getUserId(),
            Status='In Progress');
        insert openTask;
        
        Task closedtask = new Task(WhatId = acc.Id,
                                   Subject = 'Call: apex test',
                                   ActivityDate = date.today(),
                                   Status = 'Completed'
                                  );
        insert closedtask;
        Deliveries__c dlvObj=new Deliveries__c();
        dlvObj.Name='Test Delivery';
        dlvObj.Account__c=acc.Id;
        insert dlvObj;
        
        Invoice__c invObj=new Invoice__c();
        invObj.Name='Inv obj';
        
        insert invObj;
        
        Attachment accountAttach=new Attachment();   	
        accountAttach.Name='Unit Test Attachment';
        Blob bodyBlob=Blob.valueOf('Unit Test Attachment Body');
        accountAttach.body=bodyBlob;
        accountAttach.parentId=acc.id;
        insert accountAttach;
        
        Attachment orderAttach=new Attachment();   	
        orderAttach.Name='Unit Test Attachment';        
        orderAttach.body=bodyBlob;
        orderAttach.parentId=acc.id;
        insert orderAttach;
        
        Attachment dlvryAttach=new Attachment();   	
        dlvryAttach.Name='Unit Test Attachment';        
        dlvryAttach.body=bodyBlob;
        dlvryAttach.parentId=dlvObj.id;
        insert dlvryAttach;
        
        Attachment invAttach=new Attachment();   	
        invAttach.Name='Unit Test Attachment';        
        invAttach.body=bodyBlob;
        invAttach.parentId=invObj.id;
        insert invAttach;
        
        
        
        Attachment contactAttach=new Attachment();   
        contactAttach.Name='Unit Test Attachment';        
        contactAttach.body=bodyBlob;
        contactAttach.parentId=acc.id;
        insert contactAttach;
        
        ContentVersion contentVersion = new ContentVersion(
            Title = 'Penguins',
            PathOnClient = 'Penguins.jpg',
            VersionData = Blob.valueOf('Test Content'),
            IsMajorVersion = true
        );
        insert contentVersion;    
        List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
        
        //create ContentDocumentLink  record 
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = acc.id;
        cdl.ContentDocumentId = documents[0].Id;
        cdl.shareType = 'V';
        insert cdl;
        
        Opportunity opportunityToCreate = new Opportunity();
        
        
        opportunityToCreate.StageName = 'Sourcing Demand';
        opportunityToCreate.CloseDate = system.today();
        opportunityToCreate.AccountId = acc.Id;
        opportunityToCreate.Name = 'Test Opportunity Triggers';
        insert opportunityToCreate;
        
        Attachment caseAttach=new Attachment();   	
        caseAttach.Name='Unit Test Attachment';        
        caseAttach.body=bodyBlob;
        caseAttach.parentId=acc.id;
        insert caseAttach;
        
        Attachment opportunityAttach=new Attachment();   	
        opportunityAttach.Name='Unit Test Attachment';        
        opportunityAttach.body=bodyBlob;
        opportunityAttach.parentId=opportunityToCreate.id;
        insert opportunityAttach;
        
        Attachment opentaskAttach=new Attachment();   	
        opentaskAttach.Name='Unit Test Attachment';        
        opentaskAttach.body=bodyBlob;
        opentaskAttach.parentId=openTask.id;
        insert opentaskAttach;
        
        Attachment closeTaskAttach=new Attachment();   	
        closeTaskAttach.Name='Unit Test Attachment';        
        closeTaskAttach.body=bodyBlob;
        closeTaskAttach.parentId=closedtask.id;
        insert closeTaskAttach;
    }
    public static testmethod void getAllAttachments(){
        
        list<Account> accountObj=[select id,(select id from contacts),(select id from Orders),(select id from Cases),(select id from ActivityHistories),(select id from OpenActivities),(select id from Opportunities)
                                  ,(select id from Deliveries__r),(select id from Invoices__r)   
                                  from Account where name='Testing Account' limit 1];
        system.assert(accountObj.size()!=0);
        system.assert(accountObj[0].contacts.size()!=0);
        system.assert(accountObj[0].Orders.size()!=0);
        system.assert(accountObj[0].Cases.size()!=0);
        system.assert(accountObj[0].ActivityHistories.size()!=0);
        system.assert(accountObj[0].OpenActivities.size()!=0);
        system.assert(accountObj[0].Opportunities.size()!=0);
        
        map<string,list<sObject>> responseMap=AccountAttachmentsController.getAllRelatedAttachments(accountObj[0].Id);
        system.assert(responseMap.get('Attachment').size()!=0);
        system.assert(responseMap.get('File').size()!=0);        
    }
    
    public static testmethod void deleteAttachments(){
        list<Account> accountObj=[select id,(select id from contacts),(select id from Orders),(select id from Cases),(select id from ActivityHistories),(select id from OpenActivities),(select id from Opportunities)
                                  ,(select id from Deliveries__r),(select id from Invoices__r)   
                                  from Account where name='Testing Account' limit 1];
        
        
        map<string,list<sObject>> responseMap=AccountAttachmentsController.getAllRelatedAttachments(accountObj[0].Id);
        system.assert(responseMap.get('Attachment').size()!=0);
        system.assert(responseMap.get('File').size()!=0); 
        list<sObject>attLst=responseMap.get('Attachment');
        AccountAttachmentsController.deleteRelatedAttachment(attLst[0].Id);
        
        //deleting file 
        list<sObject>docLst=responseMap.get('File');
        system.assert(docLst[0].get('ContentDocumentId')!=null);
        AccountAttachmentsController.deleteRelatedAttachment(string.valueOf(docLst[0].get('ContentDocumentId')));
        
    }
    
    public static testmethod void checkAccountWithNoAttachments(){
        list<Account> accountObj=[select id from Account where Name='Testing Account Negative Case'  limit 1];
        system.assert(accountObj.size()!=0);
        AccountAttachmentsController.getAllRelatedAttachments(accountObj[0].Id);
    }
    
}