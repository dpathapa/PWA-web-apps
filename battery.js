navigator.getBattery().then(function (battery) {
  
const status = document.getElementById('status');  
  
    function updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
    }
    updateAllBatteryInfo();

    battery.addEventListener('chargingchange', () => {
        updateChargeInfo();
    });
    function updateChargeInfo() {
        status.innerHTML += "Battery charging? "
            + (battery.charging ? "Yes" : "No") + "<br />";
    }

    battery.addEventListener('levelchange', () => {
        updateLevelInfo();
    });
    function updateLevelInfo() {
        status.innerHTML += "Battery level: "
            + battery.level * 100 + "%" + "<br />";
    }

    battery.addEventListener('chargingtimechange', () => {
        updateChargingInfo();
    });
    function updateChargingInfo() {
        status.innerHTML += "Battery charging time: "
            + battery.chargingTime + " seconds" + "<br />";
    }

    battery.addEventListener('dischargingtimechange', () => {
        updateDischargingInfo();
    });
    function updateDischargingInfo() {
        status.innerHTML += "Battery discharging time: "
            + battery.dischargingTime + " seconds" + "<br />";
    }

});
