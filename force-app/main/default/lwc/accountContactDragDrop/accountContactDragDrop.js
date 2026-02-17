import { LightningElement } from "lwc";
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getAccounts from "@salesforce/apex/DragDropAccountContactController.getAccounts";
import getUnassignedContacts from "@salesforce/apex/DragDropAccountContactController.getUnassignedContacts";

export default class AccountContactDragDrop extends LightningElement {
  accounts = [];
  contacts = [];
  draggedContactId;
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
  }

  handleDragStart(event) {
    this.draggedContactId = event.target.dataset.id;
  }

  allowDrop(event) {
    event.preventDefault();
  }

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
  }
}
