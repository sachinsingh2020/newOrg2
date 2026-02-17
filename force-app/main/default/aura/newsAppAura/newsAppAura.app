<aura:application extends="ltng:outApp" access="GLOBAL" implements="ltng:allowGuestAccess" >
    <aura:dependency resource="c:newsApp" />
    <div class="slds-p-around_medium" >
        <c:newsApp/>
    </div>
</aura:application>