import { LightningElement } from "lwc";
import getAccounts from "@salesforce/apex/DragDropAccountContactController.getAccounts";
import getUnassignedContacts from "@salesforce/apex/DragDropAccountContactController.getUnassignedContacts";
import assignContact from "@salesforce/apex/DragDropAccountContactController.assignContact";

export default class AccountContactDragDrop extends LightningElement {
  accounts = [];
  contacts = [];
  draggedContactId;

  connectedCallback() {
    this.loadData();
  }

  loadData() {
    getAccounts().then((res) => {
      this.accounts = res;
    });

    getUnassignedContacts().then((res) => {
      this.contacts = res;
    });
  }

  handleDragStart(event) {
    this.draggedContactId = event.target.dataset.id;
  }

  allowDrop(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    const accountId = event.currentTarget.dataset.id;

    assignContact({
      contactId: this.draggedContactId,
      accountId: accountId
    }).then(() => {
      this.updateUI(accountId, this.draggedContactId);
    });
  }

  updateUI(accountId, contactId) {
    // Remove contact from contact list
    this.contacts = this.contacts.filter((c) => c.Id !== contactId);

    // Add contact under account
    this.accounts = this.accounts.map((acc) => {
      if (acc.accountId === accountId) {
        acc.contacts = [
          ...acc.contacts,
          { Id: contactId, LastName: "New Contact" }
        ];
      }
      return acc;
    });

    // Remove account if it has 10 contacts
    this.accounts = this.accounts.filter((acc) => acc.contacts.length < 10);
  }
}
