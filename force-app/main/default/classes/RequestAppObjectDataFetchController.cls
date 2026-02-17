public without sharing class RequestAppObjectDataFetchController {
    
    @AuraEnabled
    public static List<Leave__c> GetLeaveObjectData(){
        List<Leave__c> leaveList = [SELECT Id, Name, Employee_Email__c, Start_Date__c, End_Date__c, Leave_Type__c, Reason__c, Status__c FROM Leave__c];

        return leaveList;
    }

    @AuraEnabled
    public static List<Work_From_Home__c> GetWFHObjectData(){
        List<Work_From_Home__c> wfhList = [SELECT Id, Name, Employee_Email__c, WFH_Date__c,Reason__c, Status__c FROM Work_From_Home__c];

        return wfhList;
    }

    @AuraEnabled
    public static List<Laptop_Issue__c> GetLaptopIssueObjectData(){
        List<Laptop_Issue__c> laptopIssueList = [SELECT Id, Name, Employee_Email__c, Issue_Type__c, Issue_Description__c, Status__c FROM Laptop_Issue__c];

        return laptopIssueList;
    }

}

