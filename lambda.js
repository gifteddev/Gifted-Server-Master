const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event, context) => {
  console.log(event);
  awsServerlessExpress.proxy(server, event, context);
};
