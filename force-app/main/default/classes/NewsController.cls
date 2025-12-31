public with sharing class NewsController {


    @AuraEnabled(cacheable=false)
    public static Map<String, Object> fetchNewsData(String category,Integer pageNumber) {

        api_key__c settingKey =  api_key__c.getInstance();

        String apiKey = settingKey.Api_key__c;
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://newsapi.org/v2/everything?q=' + category + '&sortBy=publishedAt&language=en&pageSize=10&page=' + pageNumber);
        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('X-Api-Key', apiKey);
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            return (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
        } else {
            throw new AuraHandledException('Failed to fetch news: ' + res.getStatusCode());
        }
    }
}