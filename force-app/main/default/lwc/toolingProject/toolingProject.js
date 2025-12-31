import { LightningElement, track } from "lwc";
import getAllObjectNames from "@salesforce/apex/lwc_GetObjectNames.getAllObjectNames";
import getMetadataForObject from "@salesforce/apex/lwc_GetObjectNames.getMetadataForObject";
import GenerateAccessToken from '@salesforce/apex/Get_Access_Token.GenerateAccessToken';
import getAllFlowDefinitions from '@salesforce/apex/Get_Flow_Data.getAllFlowDefinitions';
import getFlowDetailById from '@salesforce/apex/Get_Flow_Data.getFlowDetailById';

export default class ToolingProject extends LightningElement {

    @track selectedValue = "";
    @track ObjectList = [];

    @track page1 = true;
    @track page2 = false;
    @track access_token = '';

    @track metadata = {
        triggers: [],
        classes: [],
        validationRules: [],
        flows: []
    };

    @track isLoading = false;
    @track cleanObjArray = [];

    connectedCallback() {
        this.generateToken();
    }

    generateToken() {
        GenerateAccessToken()
            .then((result) => {
                this.access_token = result;
                this.loadObjects();
            })
            .catch((error) => {
                console.error('Error generating access token:', error);
            });
    }

    loadObjects() {
        getAllObjectNames()
            .then((result) => {
                this.ObjectList = result.map((o) => ({
                    label: o,
                    value: o
                }));
            })
            .catch((error) => {
                console.error("Error retrieving object names:", error);
            });
    }

    handleChange(event) {
        this.selectedValue = event.detail.value;
    }

    handleNextPage1() {
        if (!this.selectedValue) {
            alert("Please select an object.");
            return;
        }
        this.page1 = false;
        this.page2 = true;
        this.fetchMetadata();
    }

    handleBack() {
        this.page1 = true;
        this.page2 = false;
    }

    fetchFlowDefinition() {
        getAllFlowDefinitions({ access_token: this.access_token })
            .then((result) => {

                const flowPromises = result.records.map((res) =>
                    getFlowDetailById({
                        access_token: this.access_token,
                        flowId: res.LatestVersionId
                    }).then((detail) => {

                        const status = detail && detail.Status ? detail.Status : "";

                        return {
                            Id: detail.Id || "",
                            DefinitionId: detail.DefinitionId || "",
                            Status: status,
                            triggerObject:
                                detail && detail.Metadata && detail.Metadata.start && detail.Metadata.start.object
                                    ? detail.Metadata.start.object
                                    : "",
                            recordTriggerType:
                                detail && detail.Metadata && detail.Metadata.start && detail.Metadata.start.recordTriggerType
                                    ? detail.Metadata.start.recordTriggerType
                                    : "",
                            triggerType:
                                detail && detail.Metadata && detail.Metadata.start && detail.Metadata.start.triggerType
                                    ? detail.Metadata.start.triggerType
                                    : "",
                            FullName: detail.FullName || "",
                            VersionNumber: detail.VersionNumber || "",

                            // STYLE CLASS FOR UI
                            statusClass:
                                status === "Active"
                                    ? "status-active"
                                    : "status-inactive"
                        };
                    })
                );

                Promise.all(flowPromises).then((finalResult) => {
                    this.cleanObjArray = finalResult;
                });

            })
            .catch((error) => {
                console.error("Error fetching flowDefinition:", error);
            });
    }

    fetchMetadata() {
        this.isLoading = true;

        getMetadataForObject({
            accessToken: this.access_token,
            objectApiName: this.selectedValue
        })
            .then((result) => {
                this.metadata = result;
                this.fetchFlowDefinition();
                this.isLoading = false;
            })
            .catch((error) => {
                this.isLoading = false;
                console.error("Error fetching metadata:", error);
            });
    }
}
