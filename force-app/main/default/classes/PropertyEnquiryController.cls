public with sharing class PropertyEnquiryController {

    @AuraEnabled
    public static Id saveEnquiry(Map<String, Object> enquiryData) {

        System.debug('Received Data: ' + JSON.serialize(enquiryData));

        Property_Enquiry__c enquiry = new Property_Enquiry__c();

        enquiry.Full_Name__c     = (String)enquiryData.get('fullName');
        enquiry.Email__c         = (String)enquiryData.get('email');
        enquiry.phone_Number__c  = (String)enquiryData.get('phone');
        enquiry.City__c          = (String)enquiryData.get('city');
        enquiry.Requirement__c   = (String)enquiryData.get('requirement');

        // Uncomment these when you add these fields in your form
        // enquiry.Budget__c = (Decimal)enquiryData.get('budget');
        // enquiry.Property_Type__c = (String)enquiryData.get('propertyType');

        insert enquiry;

        return enquiry.Id;
    }
}