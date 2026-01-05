const fs = require('fs');

const action = process.env.ACTION;
const payload = process.env.PAYLOAD ? JSON.parse(process.env.PAYLOAD) : {};

const filePath = './keys.json';
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

switch(action){
  case 'create':
    const newKey = {
      key: payload.key,
      type: payload.type,
      used: false,
      device: "",
      createdAt: Math.floor(Date.now()/1000),
      expiresAt: payload.type==="daily"?Math.floor(Date.now()/1000)+86400:
                 payload.type==="weekly"?Math.floor(Date.now()/1000)+604800:0,
      activatedAt: 0
    };
    data.keys.push(newKey);
    console.log('Key criada:', newKey.key);
    break;

  case 'revoke':
    data.keys = data.keys.map(k=> k.key===payload.key ? {...k, used:true, activatedAt:Math.floor(Date.now()/1000)} : k);
    console.log('Key revogada:', payload.key);
    break;

  case 'delete':
    data.keys = data.keys.filter(k=>k.key!==payload.key);
    console.log('Key deletada:', payload.key);
    break;

  case 'list':
    console.log(JSON.stringify(data.keys, null, 2));
    break;
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
