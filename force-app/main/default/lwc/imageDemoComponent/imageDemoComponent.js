import { LightningElement } from 'lwc';
import PRASHANT_IMAGE from '@salesforce/resourceUrl/friendImagePrashant';
import SUJIT_IMAGE from '@salesforce/resourceUrl/RealState';
export default class ImageDemoComponent extends LightningElement {
     friends = [
        {
            id: 1,
            name: 'Prashant',
            image: PRASHANT_IMAGE
        },
        {
            id: 2,
            name: 'Sujit',
            image: SUJIT_IMAGE
        }
    ];
}