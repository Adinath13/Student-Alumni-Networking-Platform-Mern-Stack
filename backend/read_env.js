const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
const envConfig = dotenv.parse(fs.readFileSync(path.join(__dirname, '.env')));

let output = '';
for (const key in envConfig) {
    output += `${key}=${envConfig[key]}\n`;
}

fs.writeFileSync('env_dump.txt', output);
console.log('Env vars dumped to env_dump.txt');
