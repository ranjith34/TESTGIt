public class QuoteCommonUtil {
   
    
    public static String expireQuote(Id recordId) {
     try {
         Quote_Header__c QuoObj = [Select Id, Status__c From Quote_Header__c where Id =: recordId];
         QuoObj.Status__c = 'Expired';
         update QuoObj;
         return 'SUCCESS';
     } catch (Exception e) {
         System.debug('An unexpected error has occurred: ' + e.getMessage());
         return e.getMessage();
       }
     }

}