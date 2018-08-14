public class QuoteViewHighlightPanelController {
    
    @AuraEnabled
    Public static string changeQuoteStatus(Id QuoteId){
        String message = QuoteCommonUtil.expireQuote(QuoteId);
        
        return message;
    }

}