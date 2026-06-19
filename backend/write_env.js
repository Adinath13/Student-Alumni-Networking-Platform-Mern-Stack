const fs = require('fs');
const path = require('path');

const content = `PORT=5001
MONGO_URI= //USE YOUR OWN
JWT_SECRET= //USE YOUR OWN
JWT_EXPIRE= //USE YOUR OWN
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
`;

fs.writeFileSync(path.join(__dirname, '.env'), content);
console.log('.env updated successfully');
