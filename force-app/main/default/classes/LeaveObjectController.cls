public with sharing class LeaveObjectController {
    
    @AuraEnabled
    public static List<Leave__c> GetLeaveObjectData(){
        List<Leave__c> leaveList = [SELECT Id, Name, Employee_Email__c, Start_Date__c, End_Date__c, Leave_Type__c, Reason__c, Status__c FROM Leave__c];

        return leaveList;
    }
}