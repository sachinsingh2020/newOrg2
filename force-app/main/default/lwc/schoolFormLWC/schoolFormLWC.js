import { LightningElement, api } from 'lwc';

export default class SchoolFormLWC extends LightningElement {
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    connectedCallback() {
        if (!this._value) {
            // Initialize structure if Agentforce sends empty value
            this._value = {
                schdata: {
                    schoolName: '',
                    schoolAddress: '',
                    numberOfStudents: null
                }
            };
        }
        console.log('Initial Value:', JSON.stringify(this._value));
    }

    // 🔹 Handlers (Agentforce requires mutating value)

    handleSchoolNameChange(event) {
        this._value.schdata.schoolName = event.target.value;
        this.notifyValueChange();
    }

    handleSchoolAddressChange(event) {
        this._value.schdata.schoolAddress = event.target.value;
        this.notifyValueChange();
    }

    handleStudentCountChange(event) {
        this._value.schdata.numberOfStudents = event.target.value;
        this.notifyValueChange();
    }

    // 🔹 Required for Agentforce Lightning Type updates
    notifyValueChange() {
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: { value: this._value }
            })
        );
    }
}
