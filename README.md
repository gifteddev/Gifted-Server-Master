## App-Directory Structure
```bash
gifted-server
├── app.js #all rest-api logic and shopify public app flow 
├── babel.config.js #babel config file
├── bash.exe.stackdump
├── build.js #create build for client(react-app)
├── build.sh
├── client #react shopify app
│   ├── bash.exe.stackdump
│   ├── package-lock.json
│   ├── package.json #dependencies file
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js #second entry level
│       ├── App.test.js
│       ├── AppRouter.js #All router
│       ├── components 
│       │   ├── 404.js 
│       │   ├── Faq.js #FAQ section 
│       │   └── Setting.js #Setting section
│       ├── index.css
│       ├── index.js #fisrt entry level
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── config
│   └── secretManager.js #keys store
├── db
│   └── BaseDB.js #mongodb database
├── debug.log
├── emailService
│   └── emailService.js #email configuration
├── emailTemplates #all email template
│   ├── CompleteCheckoutEmail.ejs
│   ├── ConfirmationEmail.ejs
│   ├── RecipientEmail.ejs
│   └── sho.png
├── lambda.js #aws lamda function 
├── package-lock.json
├── package.json
├── public #static file store
│   └── images
│       ├── banner.png
│       ├── c_logo.png
│       ├── emoji.png
│       ├── footer_gifted_logo.png
│       ├── gift.png
│       ├── glo.png
│       ├── mask.png
│       ├── on.png
│       ├── Screenshot3.12e05ded.png
│       ├── Screenshot4.65e55a1f.png
│       ├── Screenshot5.363baf1e.png
│       ├── Screenshot7.22c894f6.png
│       ├── sho.png
│       ├── shopify.png
│       ├── three.png
│       └── two.png
├── README.md
├── serverless.yml #aws configuration
├── shopifyApi #shopify public REST-API
│   └── shopify.js
├── tsconfig.json #typescript config
└── webpack.config.js #webpack file
```

# Serverless API Sample Project

This is a sample [Serverless](https://serverless.com) project that creates a serverless API using the [Serverless](https://serverless.com) framework and [Lambda API](https://github.com/jeremydaly/lambda-api), a lightweight web framework for your serverless applications.

This project is a companion to the post [How To: Build a Serverless API with Serverless, AWS Lambda and lambda-api](https://www.jeremydaly.com/build-serverless-api-serverless-aws-lambda-lambda-api) at [JeremyDaly.com](https://www.jeremydaly.com).

This project is free to use as a starting point for building your Serverless APIs.

## Requirements
This project requires the installation of the [Serverless](https://serverless.com) framework:

```bash
npm install -g serverless
```
More details at: https://serverless.com/learn/quick-start/

This project is also dependent on [Lambda API](https://github.com/jeremydaly/lambda-api) and [serverless-stage-manager](https://github.com/jeremydaly/serverless-stage-manager). Both can be installed by running the following in the cloned project folder:

```bash
npm install
```
## serverless function
`Lambda function` - 
   Lambda runs your code on high-availability compute infrastructure and performs all the administration of the compute resources, including server and operating system maintenance, capacity provisioning and automatic scaling, code and security patch deployment, and code monitoring and logging. All you need to do is supply the code.
   we used `aws-serverless-express` to create lambda function 
  ```
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const server = awsServerlessExpress.createServer(app);
module.exports.handler = (event, context) => {
  console.log(event);
  awsServerlessExpress.proxy(server, event, context);
};
  ```
 
# Gifted-Server 

## Server Setup Local
`Install package by this command`
```bash
npm install
```
server run by this command
```bash
node app.js
```
## server deploy 
`Run command `
```bash
npm run deploy-dev
```
`NOTE` : If you want changes in shopify app server then CTRL+F "// Public App flow start here" find this comment in app.js

## Shopify-Front-end (React)
Go to client by this command
``` bash
cd client
```
Install package
``` bash
npm install
```
Start Server
```bash
npm start
```

## Shopify-Front-end(React) Build
Go to root folder "Gifted-server"
``` bash
/Desktop/Gifted-server $ npm run build:dev
```
When complete build then deploy to server 


# Shopify Workflow Development.
The following setup will help developing the shopify workflows.

## modify hosts file
To be able to redirect live calls to the local instance, set the following record in your `~\etc\hosts` file
```
127.0.0.1 givingwithgifted.com
```

## Add SSL Cert
This article explains how you can setup a SSL certificate on Mac.
https://www.thepolyglotdeveloper.com/2018/11/create-self-signed-certificate-nodejs-macos/

