import { api, LightningElement } from 'lwc';

export default class ChildComponentsGetter extends LightningElement {
    _childUpdatedArray;
    @api
    get childArray(){
        return this._childUpdatedArray;

    }
    set childArray(value){
        this._childUpdatedArray=value;
        this._childUpdatedArray.push(500);

    }

}