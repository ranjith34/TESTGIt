public with sharing class TopProductsApxc {
    @AuraEnabled
    public static List<TopProducts__c> getTopProducts()
    {
        List<TopProducts__c> topProductsList = [SELECT Id,ProductURL__c,Description__c,ProductName__c from TopProducts__c LIMIT 10];
        return topProductsList;
    }

}