// Generate PBKDF2 hash for password "RequiresRoom2024!"
const crypto = require('crypto');

const password = 'RequiresRoom2024!';
const salt = 'RoomOfRequirements_Magic_Salt_2024';
const iterations = 100000;
const keylen = 32;

crypto.pbkdf2(password, salt, iterations, keylen, 'sha256', (err, derivedKey) => {
  if (err) throw err;
  console.log('Password Hash:', derivedKey.toString('hex'));
});