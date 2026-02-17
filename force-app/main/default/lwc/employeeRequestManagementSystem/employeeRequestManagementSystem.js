import { LightningElement } from 'lwc';
import GetLeaveObjectData from '@salesforce/apex/RequestAppObjectDataFetchController.GetLeaveObjectData';
import GetWFHObjectData from '@salesforce/apex/RequestAppObjectDataFetchController.GetWFHObjectData';
import GetLaptopIssueObjectData from '@salesforce/apex/RequestAppObjectDataFetchController.GetLaptopIssueObjectData';

import LeaveEmployeeName from '@salesforce/schema/Leave__c.Name';
import LeaveEmployeeEmail from '@salesforce/schema/Leave__c.Employee_Email__c';
import LeaveStartDate from '@salesforce/schema/Leave__c.Start_Date__c';
import LeaveEndDate from '@salesforce/schema/Leave__c.End_Date__c';
import LeaveType from '@salesforce/schema/Leave__c.Leave_Type__c';

import WFHEmployeeName from '@salesforce/schema/Work_From_Home__c.Name';
import WFHEmployeeEmail from '@salesforce/schema/Work_From_Home__c.Employee_Email__c';
import WFHDate from '@salesforce/schema/Work_From_Home__c.WFH_Date__c';
import WFHReason from '@salesforce/schema/Work_From_Home__c.Reason__c';
import WFHStatus from '@salesforce/schema/Work_From_Home__c.Status__c';

import LaptopIssueEmployeeName from '@salesforce/schema/Laptop_Issue__c.Name';
import LaptopIssueEmployeeEmail from '@salesforce/schema/Laptop_Issue__c.Employee_Email__c';
import LaptopIssueType from '@salesforce/schema/Laptop_Issue__c.Issue_Type__c';
import LaptopIssueDescription from '@salesforce/schema/Laptop_Issue__c.Issue_Description__c';
import LaptopIssueStatus from '@salesforce/schema/Laptop_Issue__c.Status__c';

const leaveColumns = [
    { label: 'Employee Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Employee_Email__c' },
    { label: 'Start Date', fieldName: 'Start_Date__c' },
    { label: 'End Date', fieldName: 'End_Date__c' },
    { label: 'Leave Type', fieldName: 'Leave_Type__c' },
    {
        type: 'button',
        typeAttributes: {
            label: 'Edit',
            name: 'edit',
            value: 'Leave__c',
            variant: 'brand'
        }
    }
];

const WFHColumns = [
    { label: 'Employee Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Employee_Email__c' },
    { label: 'Date', fieldName: 'WFH_Date__c' },
    { label: 'Reason', fieldName: 'Reason__c' },
    { label: 'Status', fieldName: 'Status__c' },
    {
        type: 'button',
        typeAttributes: {
            label: 'Edit',
            name: 'edit',
            value: 'Work_From_Home__c',
            variant: 'brand'
        }
    }
];

const laptopIssueColumns = [
    { label: 'Employee Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Employee_Email__c' },
    { label: 'Issue Type', fieldName: 'Issue_Type__c' },
    { label: 'Description', fieldName: 'Issue_Description__c' },
    { label: 'Status', fieldName: 'Status__c' },
    {
        type: 'button',
        typeAttributes: {
            label: 'Edit',
            name: 'edit',
            value: 'Laptop_Issue__c',
            variant: 'brand'
        }
    }
];

export default class EmployeeRequestManagementSystem extends LightningElement {

    columnForLeaveObject = leaveColumns;
    columnForWFHObject = WFHColumns;
    columnForLaptopIssueObject = laptopIssueColumns;

    leaveObjectData;
    WFHObjectData;
    laptopIssueData;

    isEditModalOpen = false;
    selectedRecordId;
    selectedObjectApiName;
    selectedFields;

    selectedRequestType;
    isLeaveSelected = false;
    isWFHSelected = false;
    isLaptopIssueSelected = false;

    picklistRequestTypeOptions = [
        { label: 'Leave Request', value: 'LeaveRequest' },
        { label: 'Work From Home Request', value: 'WorkFromHomeRequest' },
        { label: 'Laptop Issue Request', value: 'LaptopIssueRequest' }
    ];

    leaveObjectFields = [
        LeaveEmployeeName,
        LeaveEmployeeEmail,
        LeaveStartDate,
        LeaveEndDate,
        LeaveType
    ];

    workFromHomeObjectFields = [
        WFHEmployeeName,
        WFHEmployeeEmail,
        WFHDate,
        WFHReason,
        WFHStatus
    ];

    laptopIssueObjectFields = [
        LaptopIssueEmployeeName,
        LaptopIssueEmployeeEmail,
        LaptopIssueType,
        LaptopIssueDescription,
        LaptopIssueStatus
    ];

    connectedCallback() {
        this.loadData();
    }

    loadData() {
        GetLeaveObjectData().then(res => this.leaveObjectData = res);
        GetWFHObjectData().then(res => this.WFHObjectData = res);
        GetLaptopIssueObjectData().then(res => this.laptopIssueData = res);
    }

    handleRowAction(event) {
        const row = event.detail.row;
        const objectApiName = event.detail.action.value;

        this.selectedRecordId = row.Id;
        this.selectedObjectApiName = objectApiName;

        if (objectApiName === 'Leave__c') {
            this.selectedFields = this.leaveObjectFields;
        } else if (objectApiName === 'Work_From_Home__c') {
            this.selectedFields = this.workFromHomeObjectFields;
        } else {
            this.selectedFields = this.laptopIssueObjectFields;
        }

        this.isEditModalOpen = true;
    }

    handleEditSuccess() {
        this.isEditModalOpen = false;
        this.loadData();
    }

    closeModal() {
        this.isEditModalOpen = false;
    }

    handleRequestTypePicklistChange(event) {
        const value = event.target.value;
        this.isLeaveSelected = value === 'LeaveRequest';
        this.isWFHSelected = value === 'WorkFromHomeRequest';
        this.isLaptopIssueSelected = value === 'LaptopIssueRequest';
    }

    handleLeaveCreationSuccess() { this.loadData(); }
    handleWorkFromHomeCreationSuccess() { this.loadData(); }
    handleLaptopIssueCreationSuccess() { this.loadData(); }
}
