import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getAccountsWithContacts from "@salesforce/apex/AccountContactController.getAccountsWithContacts";

export default class AccountContactAccordion extends NavigationMixin(
  LightningElement
) {
  accounts = [];
  filteredAccounts = [];

  pageSize = 10;
  pageNumber = 1;

  showEditAccount = false;
  showNewContact = false;
  selectedAccountId;

  contactColumns = [
    { label: "Name", fieldName: "Name" },
    { label: "Email", fieldName: "Email" },
    { label: "Phone", fieldName: "Phone" },
    {
      type: "button",
      typeAttributes: {
        label: "View",
        name: "view",
        variant: "brand"
      }
    }
  ];

  connectedCallback() {
    this.loadAccounts();
  }

  normalize(value) {
    return value ? value : "null";
  }

  loadAccounts() {
    getAccountsWithContacts()
      .then((result) => {
        this.accounts = result.map((acc) => ({
          ...acc,
          phone: this.normalize(acc.phone),
          industry: this.normalize(acc.industry),
          type: this.normalize(acc.type),
          website: this.normalize(acc.website),
          rating: this.normalize(acc.rating),
          annualRevenue: this.normalize(acc.annualRevenue)
        }));
        this.filteredAccounts = this.accounts;
        this.pageNumber = 1;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleSearch(event) {
    const key = event.target.value.toLowerCase();
    this.filteredAccounts = this.accounts.filter(
      (acc) =>
        (acc.accountName || "").toLowerCase().includes(key) ||
        (acc.accountNumber || "").toLowerCase().includes(key) ||
        (acc.phone || "").toLowerCase().includes(key) ||
        (acc.industry || "").toLowerCase().includes(key) ||
        (acc.type || "").toLowerCase().includes(key) ||
        (acc.website || "").toLowerCase().includes(key) ||
        (acc.rating || "").toLowerCase().includes(key)
    );
    this.pageNumber = 1;
  }

  /* PAGINATION */
  get totalPages() {
    return Math.ceil(this.filteredAccounts.length / this.pageSize);
  }

  get pagedAccounts() {
    const start = (this.pageNumber - 1) * this.pageSize;
    return this.filteredAccounts.slice(start, start + this.pageSize);
  }

  get isFirstPage() {
    return this.pageNumber === 1;
  }

  get isLastPage() {
    return this.pageNumber === this.totalPages;
  }

  nextPage() {
    if (!this.isLastPage) this.pageNumber++;
  }

  prevPage() {
    if (!this.isFirstPage) this.pageNumber--;
  }

  openEditAccount(event) {
    this.selectedAccountId = event.target.dataset.id;
    this.showEditAccount = true;
  }

  openNewContact(event) {
    this.selectedAccountId = event.target.dataset.id;
    this.showNewContact = true;
  }

  closeModal() {
    this.showEditAccount = false;
    this.showNewContact = false;
  }

  handleSuccess() {
    this.closeModal();
    this.loadAccounts();
  }

  /* CONTACT NAVIGATION */
  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    if (actionName === "view") {
      this[NavigationMixin.Navigate]({
        type: "standard__recordPage",
        attributes: {
          recordId: row.Id,
          objectApiName: "Contact",
          actionName: "view"
        }
      });
    }
  }
}
