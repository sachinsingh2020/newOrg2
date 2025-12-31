import { LightningElement,track } from 'lwc';

export default class CallFlowFromLWC extends LightningElement {
    @track status = false;

    ChangeStatus(){
        if(this.status == false){
            this.status = true;
        }else{
            this.status = false;
        }
    }
}