/**************************************************************************************************************************
Name: CreateQuoteController      
Description: Server Side Controller for the Create Quote Screen which commits the data to database. 

Date         Version          Author             Summary of Changes 
*****************************************************************************************************************************
07/24/2018    1.0        Ranjith Thadakala        Initial Release
***************************************************************************************************************************/
Public with sharing class CreateQuoteController {

   
    
   /* This Class to Capute the Input Fields From Quote Screen */ 
    Public with sharing class QuoteHeaderWrapper {
        public Date InHandsDate;
        public Date DoNotShipBefore;
        public Id accountID;
        public Id opportunityId;
    }


  /* This Class to send Responce to Lightning component */
    
    Public with sharing class ResponseObject {

        @AuraEnabled public Id quoteId {
            get;
            set;
        }
        @AuraEnabled public List < Quote_Item_Level__c > Listupdated {
            get;
            set;
        }
        @AuraEnabled public List < Quote_Item_Level__c > newListupdated {
            get;
            set;
        }
    }

/* This class to Capture the Line Item fields From Quote Screen */
    Public with sharing class LineItems {
        public String Id;
        public String Name;
        public String UPK;
        public String Description;
        public String ProductLocation;
        public String itemnumber;
        public Id headerid;
        public Id lineId;
       
    }

    
/* This method called In Quote Screen to Commits the Data to Database */    
    
    @AuraEnabled
    public static ResponseObject saveandupdateQuote(String QuoteDetails, String newList, String updateList, String QuoteId) {
        system.debug(newList);
        system.debug(updateList);
        system.debug(QuoteDetails);
        system.debug(QuoteId);

        List < Quote_Item_Level__c > newobjlist = new List < Quote_Item_Level__c > ();
        List < Quote_Item_Level__c > updateobjlist = new List < Quote_Item_Level__c > ();
        ResponseObject resobj = new ResponseObject();
        QuoteHeaderWrapper quotedetailswrapper = (QuoteHeaderWrapper) JSON.deserialize(QuoteDetails, QuoteHeaderWrapper.class);

        String s1 = newList.replace('UPK__c', 'UPK');
        String s2 = s1.replace('ProductLocation__c', 'ProductLocation');
        List < LineItems > newItemsWrapper;
        if (!s2.equals('null')) {
            system.debug(!s2.equals('null'));
            newItemsWrapper = (List < LineItems > ) System.JSON.deserialize(s2, List < LineItems > .class);
        }



        if (!String.isEmpty(QuoteId)) {

            system.debug(!String.isEmpty(QuoteId));
            Quote_Header__c QutObj = [select id, In_Hands_Date__c, Do_Not_Ship_Before__c from Quote_Header__c where id =: QuoteId limit 1];
            system.debug(QutObj);

            QutObj.In_Hands_Date__c = quotedetailswrapper.InHandsDate;
            QutObj.Do_Not_Ship_Before__c = quotedetailswrapper.DoNotShipBefore;
            
             update QutObj;
            resobj.quoteId = QutObj.Id;


            if (!s2.equals('null') && !newItemsWrapper.equals('null')) {

                system.debug(!newItemsWrapper.isEmpty());
                newobjlist = CreateQuoteController.insertNewList(newItemsWrapper, QutObj.Id);
            } else {
                resobj.newListupdated = null;
            }
            system.debug('test1');
            system.debug(String.isEmpty(updateList));
            if (!String.isEmpty(updateList)) {

                system.debug(String.isEmpty(updateList));
                String s3 = updateList.replace('UPK__c', 'UPK');
                String s4 = s3.replace('ProductLocation__c', 'ProductLocation');
                system.debug(s4);

                List < LineItems > updateItemsWrapper = (List < LineItems > ) System.JSON.deserialize(s4, List < LineItems > .class);
                if (updateItemsWrapper.size() > 0) {
                    for (LineItems lineObj: updateItemsWrapper) {
                        Quote_Item_Level__c updatequotlineObj = new Quote_Item_Level__c();
                        updatequotlineObj.Id = lineObj.lineId;
                        updatequotlineObj.Quote_Header__c = QutObj.Id;
                        updatequotlineObj.Name = lineObj.Name;
                        updatequotlineObj.Product_Description__c = lineObj.Description;
                        updatequotlineObj.ProductUrl__c =  lineObj.ProductLocation;
                        updateobjlist.add(updatequotlineObj);

                    }
                    if (updateobjlist.size() > 0) {
                        update updateobjlist;

                    }
                }
            }


        } else {
            Quote_Header__c QutObject = new Quote_Header__c();
            QutObject.Account__c = quotedetailswrapper.accountID;
            QutObject.Opportunity__c = quotedetailswrapper.opportunityId;
            QutObject.In_Hands_Date__c = quotedetailswrapper.InHandsDate;
            QutObject.Do_Not_Ship_Before__c = quotedetailswrapper.DoNotShipBefore;
            insert QutObject;

            resobj.quoteId = QutObject.Id;



            system.debug(newItemsWrapper.size());
            if (newItemsWrapper.size() > 0) {

                newobjlist = CreateQuoteController.insertNewList(newItemsWrapper, QutObject.Id);

            }


        }
        system.debug(updateobjlist);
        system.debug(newobjlist);
        resobj.Listupdated = updateobjlist;
        if (!newobjlist.equals('null')) resobj.newListupdated = newobjlist;

        return resobj;
    }

/* This is a common method for inserting line Items */
    public static List < Quote_Item_Level__c > insertNewList(List < LineItems > lineList, Id QuoteId) {
        List < Quote_Item_Level__c > QuoteItemList = new List < Quote_Item_Level__c > ();

        for (LineItems lineObj: lineList) {
            Quote_Item_Level__c newquotlineObj = new Quote_Item_Level__c();
            newquotlineObj.Quote_Header__c = QuoteId;
            newquotlineObj.Name = lineObj.Name;
            newquotlineObj.Product_Description__c = lineObj.Description;
            newquotlineObj.Quote_Item_Number__c = lineObj.itemnumber;
            newquotlineObj.ProductUrl__c =  lineObj.ProductLocation;
            QuoteItemList.add(newquotlineObj);
        }
        try {
            insert QuoteItemList;
            return QuoteItemList;
        } catch (System.DmlException e) {
            for (Integer i = 0; i < e.getNumDml(); i++) {
                System.debug(e.getDmlMessage(i));
            }
            return null;

        }


    }

}