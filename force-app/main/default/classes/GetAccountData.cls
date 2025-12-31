public with sharing class GetAccountData {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountDetails(string recordId){
        return [SELECT Id, Name from Account limit 10];
    }
}