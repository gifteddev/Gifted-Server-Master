const defaultShopSetting = require("./appConstants");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const sendEmail = require("./emailService/emailService");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const bodyParser = require("body-parser");
const BaseDB = require("./db/BaseDB");
const uuidv4 = require("uuid/v4");
const ejs = require("ejs");
const shopify = require("./shopifyApi/shopify");
const _this = this;
const crypto = require("crypto");
const session = require("express-session");
const querystring = require("querystring");
const FS = require("fs");
const HTTPS = require("https");


const forwardingAddress = "https://889bc696d829.ngrok.io"; // Replace this with your HTTPS Forwarding address
const SHOPIFY_API_KEY = '6c30c2ecd899f0b8f17c3ae35220ba53';
const SHOPIFY_API_SECRET = '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';
const SHOPIFY_API_SCOPES = [
  "read_products",
  "write_script_tags",
  "write_checkouts",
  "write_draft_orders"
];

app.use(
  session({
    secret: SHOPIFY_API_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1209600000 },
    cookie: {
      sameSite: "none",
      secure: "auto",
      maxAge: 30 * 60 * 1000 // 30 mins
    }
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
    verify: function (req, res, buf, encoding) {
      //note, this will trigger only for application/json requests
      req.rawBody = buf.toString(encoding);
    }
  })
);

app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// serves shopify client app as static website.
app.use("/shopify", express.static(__dirname + "/client/build/"));

// TODO: review these middleware setup
// view engine setup
app.set("views", "./views");
app.set("view engine", "html");
app.engine("html", ejs.renderFile);
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(express.static("public"));



// note: comment out in local dev
app.use(awsServerlessExpressMiddleware.eventContext());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = { apikey: SHOPIFY_API_KEY };
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,X_SIGN_TOKEN"
  );
  next();
});


/*
* Description - This API use for fetch single store data  
* Route https://{host-url}/shopify/shopdata/?shop=gifted-test2.myshopify.com
* Method GET
*/
app.get("/shopify/shopdata", async (req, res) => {
  const shop = req.query.shop;
  const db = new BaseDB("gifted", "shopdata");
  const shopdata = await db.findOne({ shop });
  res.send(JSON.stringify(shopdata));
});

/*
* Description - This API use for fetch single gift data  
* Route https://{host-url}/shopify/gift/?giftId={giftId}
* Method GET
*/
app.get("/shopify/gift", async (req, res) => {
  const giftId = req.query.giftId;
  const db = new BaseDB("gifted", "users");
  const giftData = await db.findOne({ giftId });
  res.send(JSON.stringify(giftData));
});

/*
* description - This API use for Send email
* Route https://{host-url}/shopify/send-email 
* Method-POST
*/
app.post("/shopify/send-email", async (req, res) => {
  console.log(JSON.stringify(req.body));
  if (req.body.emailType === 1) {
    let productName = "";

    if (req.body.productUrl) {
      productName = req.body.productName;
    }
    const giftId = uuidv4();

    const options2 = {
      giftId,
      recipientEmail: req.body.recipientEmail,
      shopName: req.body.shopName,
      giverEmail: req.body.yourEmail,
      productUrl: `${req.body.productUrl}&giftId=${giftId}`,
      productName,
      giverName: req.body.yourName,
      recipientName: req.body.recipientName,
      message: req.body.message,
      giftOccasion: req.body.giftOccasion,
      emailType: req.body.emailType
    };
    console.log("options2", options2);
    await sendEmail(options2);
    const db = new BaseDB("gifted", "users");
    await db.insertOne(options2);
  } else if (req.body.emailType === 2) {
    let shippingDetails = {};
    let address = "";
    let city = "";
    let state = "";
    let company = "";
    let additionalAddress = "";
    let country = "";
    let zip = "";
    let phone = "";

    if (req.body.shippingDetails) {
      shippingDetails = req.body.shippingDetails;
      address = shippingDetails.address;
      city = shippingDetails.city;
      state = shippingDetails.state;
      company = shippingDetails.company;
      additionalAddress = shippingDetails.additionalAddress;
      country = shippingDetails.country;
      zip = shippingDetails.zip;
      phone = shippingDetails.phone;
    }

    const options = {
      approvedGiftId: req.body.giftId,
      subject: req.body.subject,
      shopName: req.body.shopName,
      recipientEmail: req.body.recipientEmail,
      giverEmail: req.body.yourEmail,
      productUrl: req.body.productUrl,
      emailType: req.body.emailType,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      giverName: req.body.giverName,
      message: req.body.message,
      city,
      state,
      address,
      additionalAddress,
      country,
      zip,
      phone,
      company
    };

    console.log("options", options);
    await sendEmail(options);
    const db = new BaseDB("gifted", "users");
    await db.insertOne(options);
  }
  res.send("Hello World!");
});


/***************************************************Public App flow start here***********************************/

/*
* Description - This api use for OAuth route
* Route https://{host-url}/shopify/install/?shop=gifted-test2.myshopify.com
* Method GET
*/
app.get("/shopify/install", async (req, res) => {
  if (!req.query.shop) return res.sendStatus(401);
  const db = new BaseDB("gifted", "shopdata");
  const shop = req.query.shop;
  const shopdata = await db.findOne({ shop });

  console.log("Shop Data from DB:", shopdata);


  // TODO: only redirect to setting if shop.is_installed is true
  // Update all active shops in DB with is_installed = true before publish.

  if (shopdata && shopdata.is_installed === true && false) {
    // app is already installed for this shop, go to the dashboard
    res.redirect("/shopify/setting?shop=" + req.query.shop);
  } else {
    console.log(req.query.shop, "install request received from Shopify");

    if (
      req.query.hmac ==
      getHmacFromQueryString(
        req.query,
        SHOPIFY_API_SECRET
      ) ||
      req.query.shop == process.env.MY_TEST_STORE
    ) {
      req.session.id = genCode(8);
      if (req.session.data) {
        req.session.data = undefined;
      }

      apiSecret = SHOPIFY_API_SECRET;
      const redirectUri = forwardingAddress + "/shopify/callback";
      const installUrl =
        "https://" +
        req.query.shop +
        "/admin/oauth/authorize?client_id=" +
        SHOPIFY_API_KEY +
        "&scope=" +
        SHOPIFY_API_SCOPES +
        "&state=" +
        req.session.id +
        "&redirect_uri=" +
        redirectUri;

      console.log(
        req.query.shop,
        "redirecting to install confirmation:",
        installUrl
      );
      res.redirect(installUrl);
    } else {
      console.error(req.query.shop, "unable to verify hmac token");
      res.sendStatus(401);
    }
  }
});

/*
* Description - use for callback and user validition after complete callback install application done .
* Route https://{host-url}/shopify/callback/?shop=gifted-test2.myshopify.com
* Method GET
*/
app.get("/shopify/callback", async (req, res) => {
  // Ensure the provided nonce is the same one we provided to Shopify during oauth/authorize request
  // Ensure the provided hostname parameter is a valid hostname, ends with myshopify.com, and does not contain characters other than letters (a-z), numbers (0-9), dots, and hyphens.
  // Ensure the provided hmac is valid
  // 1 point MEESING STATE VALUE CHANGE

  const myshopify_domain = req.query.shop;

  console.log(myshopify_domain, "installation confirmed");
  const authenticated =
    myshopify_domain.endsWith(".myshopify.com") &&
    getHmacFromQueryString(
      req.query,
      SHOPIFY_API_SECRET
    ) === req.query.hmac;
  console.log(
    getHmacFromQueryString(
      req.query,
      SHOPIFY_API_SECRET
    ) === req.query.hmac
  );

  if (!authenticated) {
    console.error(
      myshopify_domain,
      "Unable to authenticate installation request"
    );
    res.sendStatus(401, "Unable to authenticate installation request");
    return;
  }

  console.log(myshopify_domain, "installation is authenticated");

  const accesstoken = await shopify.getAccessToken(
    myshopify_domain,
    req.query.code
  );

  const shopCredentials = {
    shop: myshopify_domain,
    access_token: accesstoken
  };

  const shopifyShopInfo = await shopify.getShopInfo(shopCredentials);
  const shopInfo =
  {
    shop: shopCredentials.shop,
    accesstoken: shopCredentials.access_token,
    installation_date: new Date(),
    is_installed: true,
    shop_name: shopifyShopInfo.name,
    shop_email: shopifyShopInfo.email,
    shop_domain: shopifyShopInfo.domain,
    shop_province: shopifyShopInfo.province,
    shop_country: shopifyShopInfo.country,
    shop_address1: shopifyShopInfo.address1,
    shop_address2: shopifyShopInfo.address2,
    shop_zip: shopifyShopInfo.zip,
    shop_city: shopifyShopInfo.city,
    shop_phone: shopifyShopInfo.phone,
    shop_primary_locale: shopifyShopInfo.primary_locale,
    shop_created_at: shopifyShopInfo.created_at,
    shop_updated_at: shopifyShopInfo.updated_at,
    shop_country_code: shopifyShopInfo.country_code,
    shop_country_name: shopifyShopInfo.country_name,
    shop_currency: shopifyShopInfo.currency,
    shop_shop_owner: shopifyShopInfo.shop_owner,
    shop_plan_display_name: shopifyShopInfo.plan_display_name,
    shop_plan_name: shopifyShopInfo.plan_name,
    shop_has_gift_cards: shopifyShopInfo.has_gift_cards,
    shop_myshopify_domain: shopifyShopInfo.myshopify_domain,
    shop_has_storefront: shopifyShopInfo.has_storefront,
  }

  const shopSetting =
  {
    shop: shopCredentials.shop,
    ...defaultShopSetting.DEFAULT_SHOP_SETTING
  }

  const db = new BaseDB("gifted", "shopdata");
  const existingShop = await db.findOne({ shop: shopCredentials.shop });

  const dbUpdate = new BaseDB("gifted", "shopdata");
  if (existingShop) {
    console.log(myshopify_domain, "updated");
    await dbUpdate.updateOne({ shop: shopCredentials.shop }, { $set: { ...shopInfo } });
  } else {
    console.log(myshopify_domain, "inserted");
    await dbUpdate.insertOne(shopInfo);
  }

  const settingDB = new BaseDB("gifted", "shopSettings");
  const existingSetting = await settingDB.findOne({ shop: shopCredentials.shop });

  const settingDBUpdate = new BaseDB("gifted", "shopSettings");
  if (existingSetting) {
    console.log(myshopify_domain, "updated setting");
    await settingDBUpdate.updateOne({ shop: shopCredentials.shop }, { $set: { ...shopSetting } });
  } else {
    console.log(myshopify_domain, "inserted setting");
    await settingDBUpdate.insertOne(shopSetting);
  }

  await _this.registerScript(shopCredentials);

  res.locals.h.origin = myshopify_domain;

  await _this.subscribeWebhook(shopCredentials, "app/uninstalled", "/shopify/uninstalled");
  res.redirect(`/shopify/setting?shop=${myshopify_domain}`);
});

/*
* Description - This API use for store data delete . here is /shopify/uninstalled is webhook route when user uninstall
*               then this event fire  
* Route https://{host-url}/shopify/uninstalled/?shop=gifted-test2.myshopify.com
* Method POST
*/
app.post("/shopify/uninstalled", async (req, res) => {
  console.log("Webhook heard!");
  const message_hmac = req.get("X-Shopify-Hmac-Sha256");
  const computed_hmac = getHmacFromMessage(
    req.rawBody,
    SHOPIFY_API_SECRET
  );
  console.log(computed_hmac, "computed_hmac");
  console.log(message_hmac, "message_hmac");

  const shop = req.header("X-Shopify-Shop-Domain");
  console.log("raw body", req.rawBody);
  if (message_hmac == computed_hmac) {
    try {
      const db = new BaseDB("gifted", "shopdata");
      await db.updateOne({ shop }, { $set: { is_installed: false, uninstall_date: new Date() } });

      console.log(shop, "was successfully uninstalled");
      res.status(200).send("OK");
    } catch (error) {
      console.log("error", error);
    }
  }
});

app.get("/shopify/settings", async (req, res) => {
  const db = new BaseDB("gifted", "shopSettings");
  const shop = req.query.shop;
  let shopSetting = await db.findOne({ shop });
  if(!shopSetting)
  {
    shopSetting =
    {
      shop: shopCredentials.shop,
      ...defaultShopSetting.DEFAULT_SHOP_SETTING
    }
  }
  res.status(200).send(shopSetting);
});

app.post("/shopify/settings", async (req, res) => {
  const db = new BaseDB("gifted", "shopSettings");
  const shop = req.body.shop;
  const shopSetting = await db.findOne({ shop });
  if (shopSetting) {
    const dbUpdate = new BaseDB("gifted", "shopSettings");
    await dbUpdate.updateOne({ shop }, { $set: { 
      modal_color: req.body.modal,
      background_color: req.body.background,
      font_color: req.body.font,
      font_family: req.body.activeFontFamily,
      is_customized: true,
    } });
    res.status(200).send({success: true});
  }
  res.status(201).send({success: false, reason: "It doesn't exist."});
});

app.post("/shopify/default", async (req, res) => {
  const db = new BaseDB("gifted", "shopSettings");
  const shop = req.body.shop;
  const shopdata = await db.findOne({ shop });
  if (shopdata) {
    const dbUpdate = new BaseDB("gifted", "shopSettings");
    await dbUpdate.updateOne({ shop }, { $set: { 
      is_customized: false,
    } });
    res.status(200).send({success: true});
  }
  res.status(201).send({success: false, reason: "It doesn't exist."});
});

exports.subscribeWebhook = async (data, topic, endpoint) => {
  const id = await shopify.subscribeWebhook(data, topic, endpoint);
  console.log(data.shop, "subscribed to", topic, "webhook");
};

exports.registerScript = async(data) => {
  const response = await shopify.registerScript(data);
  console.log(data, response);
}

function getHmacFromMessage(message, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");
}

function getHmacFromQueryString(input_querystring, secret) {
  var map = JSON.parse(JSON.stringify(input_querystring));
  delete map["signature"];
  delete map["hmac"];

  var message = querystring.stringify(map);

  // any provided hmac from Shopify is calculated without URI-encoded 'protocol' property, so we need to do the same
  message = message.replace(encodeURIComponent("https://"), "https://");

  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}

function genCode(digits) {
  var code = "";

  for (var i = 0; i < digits; i++)
    code += String(Math.floor(Math.random() * (9 - 0) + 0));

  return code;
}

app.get("/shopify/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.get("/custom-script.js", function(req, res) {
  res.sendFile(path.join(__dirname, "customScripts", "custom-script.js"));
});
// app.use(express.static(__dirname + 'customScripts'));

module.exports = app;
// // only add during development use 80
const exposedPort = 3000;
app.listen(exposedPort, () => {
  console.log(`Example app listening on port ${exposedPort}!`);
});

// // only add during development
// // how to setup https://medium.com/@TinaHeiligers1/localhost-on-https-my-domain-on-a-mac-c2f1a98d65a6
// HTTPS.createServer({
//   key: FS.readFileSync(path.join(__dirname, "ssl", "givingwithgifted.key")),
//   cert: FS.readFileSync(path.join(__dirname, "ssl", "givingwithgifted.crt"))
// }, app).listen(443, () => {
//   console.log("Listening at :443...");
// });