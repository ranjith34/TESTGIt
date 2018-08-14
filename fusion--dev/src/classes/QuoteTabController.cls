public class QuoteTabController {
    
    @AuraEnabled
    public static List<Quote_Item_Level__c> getRelatedLineItems(Id QuoteId){
      Quote_Header__c quoteObj = [select Id,(select Id, Name,ProductUrl__c, Product_Description__c from Quote_Items__r) from Quote_Header__c where Id =: QuoteId limit 1];
      return quoteObj.Quote_Items__r;
    }

}