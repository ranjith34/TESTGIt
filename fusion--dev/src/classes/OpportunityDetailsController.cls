public class OpportunityDetailsController {
    @AuraEnabled
    public static List<Opportunity> getRelatedOpportunities(Id recId){
         Account accobj = [Select Id,(select Id, Name,StageName,Type, CreatedDate from Opportunities where IsClosed = false ) from Account where Id =:recId limit 1];
         return accobj.Opportunities;
    }

}