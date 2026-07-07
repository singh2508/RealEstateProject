import { LightningElement } from 'lwc';
import bgImage from '@salesforce/resourceUrl/RealState';
import saveEnquiry from '@salesforce/apex/PropertyEnquiryController.saveEnquiry';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class EnquiryForm extends LightningElement {
    backgroundStyle;
    showModal = false;

    formData = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    requirement: ''
};

isLoading = false;

    connectedCallback() {
        this.backgroundStyle =
            `background-image:
            linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)),
            url(${bgImage});
            background-size:cover;
            background-position:center;
            background-repeat:no-repeat;
            height:100vh;`;
    }

    openModal() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    handleChange(event) {
    const { name, value } = event.target;

    this.formData = {
        ...this.formData,
        [name]: value
    };
}
validateForm() {
    const inputs = this.template.querySelectorAll(
        'lightning-input, lightning-textarea'
    );

    return [...inputs].every(input => {
        input.reportValidity();
        return input.checkValidity();
    });
}
resetForm() {
    this.formData = {
        fullName: '',
        email: '',
        phone: '',
        city: '',
        requirement: ''
    };
}

handleSubmit() {

    if (!this.validateForm()) {
        return;
    }

    this.isLoading = true;
    console.log('Form Data:', JSON.stringify(this.formData));

    saveEnquiry({
         enquiryData: JSON.stringify(this.formData)
        
    })
    .then(recordId => {

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Enquiry submitted successfully.',
                variant: 'success'
            })
        );

        console.log('Created Record Id:', recordId);

        this.resetForm();
        this.closeModal();

    })
    .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error'
            })
        );

    })
    .finally(() => {
        this.isLoading = false;
    });

}

}