const express = require('express');
const config = require('./config');
const fork = require('child_process').fork;

const { v4: uuidv4 } = require('uuid')

const app = express()

app.get('/mine', (req, res) => {
  
  let { hashes } = req.query;
  const reqId = uuidv4();
  startHash(hashes, reqId).then(()=>{
    console.timeEnd(`Time for request: ${reqId}`);
    res.status(200).json({ hashes: minedHashes });
  })


});

function startHash(hashes, reqId) {
  return new Promise(function(resolve, reject) {
    hashes = hashes || [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];
    minedHashes = [];
    
    console.time(`Time for request: ${reqId}`);
    
    hashes.map((hash) => {
      const forked = fork('./src/services/miner.js');

      forked.on('message', (returnedHash) => {
        minedHashes.push(returnedHash)
        console.log('Done mining hash:', returnedHash);
      });
    
      forked.on('error', (error) => {
        console.error('Ups! Something went wrong: '+error);
      });

      forked.send(hash);
    });

    resolve();
  });
  
}

module.exports = function () {
  app.listen(config.port, config.host, () => {
    console.log(`Running at http://${config.host}:${config.port}/`)
  })
}
