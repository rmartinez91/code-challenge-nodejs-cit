const SHA256 = require('crypto-js/sha256')


const hashIt = (data) => {
  let hash = data
  const difficulty = 5
  let nonce = 0
  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    nonce++
    hash = SHA256(hash + nonce).toString()
  }
  return hash
}

process.on('message', (data) => {
  const hashed = hashIt(data);
  process.send(hashed);
});

