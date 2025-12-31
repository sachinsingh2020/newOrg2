import { LightningElement,api } from 'lwc';

export default class MyChild extends LightningElement {
    @api count;
    @api message;

         notifyParent() {
    this.dispatchEvent(new CustomEvent('myevent', { detail: { ok: true } }));
  }
}