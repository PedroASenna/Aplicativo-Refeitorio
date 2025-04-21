const { networkInterfaces } = require('os');
const fs = require('fs');

function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
}

const ip = getLocalIP();
const envContent = `API_URL=http://${ip}:5000/api`;

fs.writeFileSync('.env', envContent);
console.log(`.env criado com IP: ${ip}`);
