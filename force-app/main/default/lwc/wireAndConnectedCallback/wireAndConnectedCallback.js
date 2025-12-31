import { LightningElement,api,wire } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import getAccountDetails from "@salesforce/apex/GetAccountData.getAccountDetails";

export default class WireAndConnectedCallback extends NavigationMixin(LightningElement) {
    @api recordId;

    @wire(getAccountDetails,{recordId: '$recordId'})
    WiredAccounts({data,error}){
        console.log(data,error);
    }
}