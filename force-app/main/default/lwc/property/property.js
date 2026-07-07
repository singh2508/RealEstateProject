import { LightningElement,wire } from 'lwc';
import PROPERTY_OBJECT from '@salesforce/schema/Property__c';
import PROPERTY_TYPE_FIELD from '@salesforce/schema/Property__c.Property_Type__c';
import STATUS_FIELD from '@salesforce/schema/Property__c.Status__c';
import saveProperty from '@salesforce/apex/PropertyController.saveProperty';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

export default class Property extends LightningElement {
    //store all property details
    property = {
    name: '',
    propertyType: '',
    price: null,
    bedrooms: null,
    bathrooms: null,
    area: null,
    city: '',
    builder: '',
    status: '',
    description: '',
    imageUrl: ''
};
//options for property type
propertyTypeOptions =[];

//Options for Status
statusOptions = [];
isLoading = false;

@wire(getObjectInfo, {
    objectApiName: PROPERTY_OBJECT
})
objectInfo;

@wire(getPicklistValues, {
    recordTypeId: '$objectInfo.data.defaultRecordTypeId',
    fieldApiName: PROPERTY_TYPE_FIELD
})
propertyTypePicklist({ data, error }) {

    if (data) {
        this.propertyTypeOptions = data.values;
    } else if (error){
        console.error('Property Type Error', error);
    }
}
@wire(getPicklistValues, {
    recordTypeId: '$objectInfo.data.defaultRecordTypeId',
    fieldApiName: STATUS_FIELD
})
statusPicklist({ data, error }) {

    if (data) {
        this.statusOptions = data.values;
    }else if (error){
        console.error('Status Type Error', error);
    }
}
handleChange(event) {

    const { name, value } = event.target;

    this.property = {
        ...this.property,
        [name]: value
    };
}
validateForm() {

    const inputs = this.template.querySelectorAll(
        'lightning-input, lightning-combobox, lightning-textarea'
    );

    return [...inputs].every(input => {
        input.reportValidity();
        return input.checkValidity();
    });

}
resetForm() {

    this.property = {
        name: '',
        propertyType: '',
        price: null,
        bedrooms: null,
        bathrooms: null,
        area: null,
        city: '',
        builder: '',
        status: '',
        description: '',
        imageUrl: ''
    };

}
handleReset() {
    this.resetForm();
}

handleSave() {

    // Step 1: Validate the form
    if (!this.validateForm()) {
        return;
    }

    // Step 2: Show spinner
    this.isLoading = true;

    // Step 3: Call Apex
    saveProperty({
        propertyData: this.property
    })
    .then(recordId => {

        // Success Toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Property saved successfully.',
                variant: 'success'
            })
        );

        console.log('Created Property Id:', recordId);

        // Reset Form
        this.resetForm();

    })
    .catch(error => {

        console.error('Save Property Error:', JSON.stringify(error));

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: error.body?.message || 'An unexpected error occurred.',
                variant: 'error'
            })
        );

    })
    .finally(() => {

        // Hide Spinner
        this.isLoading = false;

    });

}

}