public with sharing class PropertyController {
    @AuraEnabled
    public static Id saveProperty(Map<String, Object> propertyData) {

        System.debug('Received Data: ' + JSON.serialize(propertyData));

        Property__c property = new Property__c();

        property.Name = (String) propertyData.get('name');
        property.Property_Type__c = (String) propertyData.get('propertyType');
        property.Price__c = Decimal.valueOf(String.valueOf(propertyData.get('price')));
        property.BedRooms__c = Integer.valueOf(String.valueOf(propertyData.get('bedrooms')));
        property.BathRooms__c = Integer.valueOf(String.valueOf(propertyData.get('bathrooms')));
        property.Area__c = Decimal.valueOf(String.valueOf(propertyData.get('area')));
        property.City__c = (String) propertyData.get('city');
        property.Builder__c = (String) propertyData.get('builder');
        property.Status__c = (String) propertyData.get('status');
        property.Description__c = (String) propertyData.get('description');
        property.Image_URL__c = (String) propertyData.get('imageUrl');

        insert property;

        return property.Id;
    }

    @AuraEnabled(cacheable=true)
     public static List<Property__c> getProperties() {

        return [
        SELECT Id,
               Name,
               Property_Type__c,
               Price__c,
               City__c,
               Status__c
        FROM Property__c
        ORDER BY CreatedDate DESC
    ];
}
    
}