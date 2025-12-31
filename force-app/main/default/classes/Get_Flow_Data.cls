public with sharing class Get_Flow_Data {

    public static final String INSTANCE_URL = 'https://orgfarm-dc1eac9450-dev-ed.develop.my.salesforce.com';
    @AuraEnabled(cacheable=false)
    public static Map<String, Object> getAllFlowDefinitions(String access_token){
        String endpoint = INSTANCE_URL + '/services/data/v65.0/tooling/query/?q=SELECT+Id,+DeveloperName,+ActiveVersionId,+LatestVersionId+FROM+FlowDefinition';

        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setHeader('Authorization','Bearer '+access_token);
        req.setHeader('Content-Type','application/json');
        req.setMethod('GET');

        Http h = new Http();
        HttpResponse res = h.send(req);
        Map<String,Object> fullResponse = new Map<String,Object>();
        if(res.getStatusCode()== 200 || res.getStatusCode()==201){
            fullResponse= (Map<String, Object>) JSON.deserializeUntyped(res.getBody());   
        }else{
            System.debug('Getting FlowDefinition Failed....'+res.getBody());
        }

        return fullResponse;
    }

    @AuraEnabled(cacheable=false)
    public static Map<String, Object> getFlowDetailById(String access_token,String flowId){
        System.debug('Access Token: '+access_token);
        System.debug('Flow Id: '+flowId);
        
        String endpoint = INSTANCE_URL + '/services/data/v65.0/tooling/sobjects/Flow/'+ flowId;

        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setHeader('Authorization','Bearer '+access_token);
        req.setHeader('Content-Type','application/json');
        req.setMethod('GET');

        Http h = new Http();
        HttpResponse res = h.send(req);
        Map<String,Object> fullResponse = new Map<String,Object>();
        if(res.getStatusCode()== 200 || res.getStatusCode()==201){
            fullResponse= (Map<String, Object>) JSON.deserializeUntyped(res.getBody());   
        }else{
            System.debug('Getting FlowDefinition Failed....'+res.getBody());
        }

        return fullResponse;
    }
}