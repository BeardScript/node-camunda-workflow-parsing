const inputFilePath = "./diagram_1.bpmn";
const fs = require('fs');
const xmlFile = fs.readFileSync(inputFilePath, {encoding: 'utf-8'});

const Promise = require('bluebird');
const seneca = require('seneca')();

seneca.client({port: 10101});

const act = Promise.promisify(seneca.act, {context: seneca});

act({cmd:'save-model-from-file', xmlFile:xmlFile})
  .then(function (result) {
    console.log(JSON.stringify(result, null, 4));
  })
  .catch(function (err) {
    if(err) throw "ERROR when attempting to call microservice: "+ err;
  });