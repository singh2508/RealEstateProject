// ===============================================
// IMPORTS
// ===============================================

// LWC Base Classes
import { LightningElement, wire } from 'lwc';

// Navigation
import { NavigationMixin } from 'lightning/navigation';

// Lightning Data Service
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

// Apex Controller
import getProperties from '@salesforce/apex/PropertyController.getProperties';

// Schema Imports
import PROPERTY_OBJECT from '@salesforce/schema/Property__c';
import PROPERTY_TYPE_FIELD from '@salesforce/schema/Property__c.Property_Type__c';
import STATUS_FIELD from '@salesforce/schema/Property__c.Status__c';

// UI API
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

// Toast & Confirmation Dialog
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningConfirm from 'lightning/confirm';

// ===============================================
// DATATABLE COLUMN CONFIGURATION
// ===============================================

const COLUMNS = [
    {
        label: 'Property Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Property Type',
        fieldName: 'Property_Type__c',
        type: 'text'
    },
    {
        label: 'Price',
        fieldName: 'Price__c',
        type: 'currency'
    },
    {
        label: 'City',
        fieldName: 'City__c',
        type: 'text'
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text'
    },

    {
    type: 'action',
    typeAttributes: {
        rowActions: [
            { label: 'View', name: 'view' },
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' }
        ]
    }
}
];

export default class PropertyList extends NavigationMixin(LightningElement) {
     // ===============================================
    // COMPONENT VARIABLES
    // ===============================================
    // Datatable configuration
    columns = COLUMNS;
   
    // Property Records
    properties = [];
    allProperties = [];
      // Error Handling
    error;
     // Search & Filter Variables
    searchKey = '';
    selectedPropertyType = '';
    selectedStatus = '';
 // Picklist Options
    propertyTypeOptions = [];
    statusOptions = [];
 // Stores wired result for refreshApex()
    wiredPropertyResult;
    // ===============================================
// LOAD PROPERTY RECORDS
// Fetches all Property records from Apex
// ===============================================
// client side filtering 

    @wire(getProperties)
    wiredProperties(result) {

    this.wiredPropertyResult = result;
    const { data, error } = result;
        if (data) {
            this.properties = data;
            this.allProperties = data;
            this.error = undefined;
        } 
        else if (error) {
            this.error = error;
            this.properties = [];
            console.error(error);
        }
    }


    @wire(getPicklistValues, {
    recordTypeId: '$objectInfo.data.defaultRecordTypeId',
    fieldApiName: STATUS_FIELD
})
statusPicklist({ data, error }) {

    if (data) {

        this.statusOptions = [
            { label: 'All', value: '' },
            ...data.values
        ];

    } else if (error) {

        console.error(error);

    }
}
    handleSearch(event) {

     this.searchKey = event.target.value.toLowerCase();

    this.filterProperties();

}
handleRowAction(event) {

    const actionName = event.detail.action.name;
    const row = event.detail.row;

    switch(actionName) {

        case 'view':
            this.viewRecord(row.Id);
            break;

        case 'edit':
            this.editRecord(row.Id);
            console.log('Edit Clicked');
            break;

        case 'delete':
            this.deleteProperty(row.Id);
            console.log('Delete Clicked');
            break;

        default:
    }

}
// ===============================================
// NAVIGATION METHODS
// Opens standard Salesforce Record Pages
// ===============================================
viewRecord(recordId) {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: recordId,
            objectApiName: 'Property__c',
            actionName: 'view'

        }
    });

}
editRecord(recordId){
     this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: recordId,
            objectApiName: 'Property__c',
            actionName: 'edit'
        }
    });

}

// ===============================================
// DELETE PROPERTY
// Displays confirmation dialog before deleting
// Refreshes datatable after successful deletion
// ===============================================
async deleteProperty(recordId) {

    const result = await LightningConfirm.open({
        message: 'Are you sure you want to delete this property?',
        label: 'Delete Property',
        theme: 'warning'
    });

    if (!result) {
        return;
    }

    deleteRecord(recordId)
        .then(() => {

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Property deleted successfully.',
                    variant: 'success'
                })
            );

            return refreshApex(this.wiredPropertyResult);

        })
        .catch(error => {

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );

        });
}

@wire(getObjectInfo, {
    objectApiName: PROPERTY_OBJECT
})
objectInfo;
@wire(getPicklistValues, {
    recordTypeId: '$objectInfo.data.defaultRecordTypeId',
    fieldApiName: PROPERTY_TYPE_FIELD
})

// ===============================================
// LOAD PROPERTY TYPE PICKLIST
// Fetches Property Type values dynamically
// ===============================================
propertyTypePicklist({ data, error }) {

    if (data) {

        this.propertyTypeOptions = [
            { label: 'All', value: '' },
            ...data.values
        ];

    } else if (error) {

        console.error(error);

    }

}
handlePropertyTypeFilter(event){
    this.selectedPropertyType = event.detail.value;
    this.filterProperties();

}
handleStatusFilter(event){

      this.selectedStatus = event.detail.value;

    this.filterProperties();

}
// ===============================================
// SEARCH & FILTER METHODS
// Handles Search, Property Type and Status filtering
// ===============================================

filterProperties() {

    this.properties = this.allProperties.filter(property => {

        const matchesSearch =
            !this.searchKey ||
            property.Name.toLowerCase().includes(this.searchKey);

        const matchesPropertyType =
            !this.selectedPropertyType ||
            property.Property_Type__c === this.selectedPropertyType;

        const matchesStatus =
              !this.selectedStatus ||
              property.Status__c === this.selectedStatus;

              return matchesSearch && matchesPropertyType && matchesStatus;

    });
}
}