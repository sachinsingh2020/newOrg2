import { LightningElement } from "lwc";
<<<<<<< HEAD
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getAccounts from "@salesforce/apex/DragDropAccountContactController.getAccounts";
import getUnassignedContacts from "@salesforce/apex/DragDropAccountContactController.getUnassignedContacts";
=======
import getAccounts from "@salesforce/apex/DragDropAccountContactController.getAccounts";
import getUnassignedContacts from "@salesforce/apex/DragDropAccountContactController.getUnassignedContacts";
import assignContact from "@salesforce/apex/DragDropAccountContactController.assignContact";
>>>>>>> 1f2c344ead1bab40ea548fb8a3ef9e74687312c2

export default class AccountContactDragDrop extends LightningElement {
  accounts = [];
  contacts = [];
  draggedContactId;
<<<<<<< HEAD
  isLoading = false;

  connectedCallback() {
    this.loadAllData();
  }

  async loadAllData() {
    this.isLoading = true;
    try {
      const accData = await getAccounts();
      this.accounts = accData.map((acc) => ({
        ...acc,
        contacts: acc.contacts.map((con, idx) => ({
          ...con,
          displayIndex: idx + 1
        }))
      }));

      this.contacts = await getUnassignedContacts();
    } catch (e) {
      this.showToast("Error", e.body?.message, "error");
    } finally {
      this.isLoading = false;
    }
=======

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
>>>>>>> 1f2c344ead1bab40ea548fb8a3ef9e74687312c2
  }

  handleDragStart(event) {
    this.draggedContactId = event.target.dataset.id;
  }

  allowDrop(event) {
    event.preventDefault();
  }

<<<<<<< HEAD
  async handleDrop(event) {
    const accountId = event.currentTarget.dataset.id;

    this.isLoading = true;

    try {
      await updateRecord({
        fields: {
          Id: this.draggedContactId,
          AccountId: accountId
        }
      });

      await this.loadAllData();

      this.showToast("Success", "Contact assigned successfully", "success");
    } catch (error) {
      this.showToast("Error", error.body?.message || "Update failed", "error");
    } finally {
      this.isLoading = false;
    }
  }

  showToast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
=======
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
>>>>>>> 1f2c344ead1bab40ea548fb8a3ef9e74687312c2
  }
}
