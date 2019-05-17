const status = document.getElementById('device-status');

window.addEventListener("deviceorientation", event => {
    let {alpha, beta, gamma} = event;
    
    alpha = Math.floor((alpha/360) * 255);
    beta = Math.floor(((beta + 180) / 360) * 255);
    gamma = Math.floor(((gamma + 90) / 180) * 255);
    
    document.body.style.backgroundColor = `rgb(${alpha}, ${beta}, ${gamma}`;
  });
  