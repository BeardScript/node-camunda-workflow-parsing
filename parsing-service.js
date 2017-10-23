const seneca = require('seneca');

const createModelFromFile = require('./saveModelFromFile');

seneca()
  .use(createModelFromFile)
  .listen(10101);