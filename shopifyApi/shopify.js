const promiseRetry = require("promise-retry");
const request = require("request");

const forwardingAddress = "https://889bc696d829.ngrok.io"; // Replace this with your HTTPS Forwarding address
const SHOPIFY_API_KEY = '6c30c2ecd899f0b8f17c3ae35220ba53';
const SHOPIFY_API_SECRET = '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';

// TODO: store shopify API version in constant.

// All post request here
async function ShopifyPost(shop, accesstoken, url, bodydata, func) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://" + shop + url,
        headers: { "X-Shopify-Access-Token": accesstoken },
        body: bodydata,
        json: true
      },
      function(error, response, body) {
        handleShopifyResponse(
          shop,
          func,
          error,
          response,
          body,
          resolve,
          reject
        );
      }
    );
  });
}
function handleShopifyResponse(
  shop,
  func,
  error,
  response,
  body,
  resolve,
  reject
) {
  if (!response) {
    // can happen sometimes
    console.error(shop, func, "(no response)");
    var e = new Error("empty response from Shopify");
    e.code = 410;
    reject(e);
  } else {
    console.log(
      shop,
      func,
      response.statusCode,
      response.headers["x-shopify-shop-api-call-limit"] || ""
    );

    if (error || (body && body.errors)) {
      var e = new Error(error || JSON.stringify(body.errors));
      e.code = response.statusCode;
      reject(e);
    } else if (response.statusCode == 429) {
      var e = new Error(response.statusMessage);
      e.code = response.statusCode;
      reject(e);
    } else if (response.statusCode >= 500) {
      var e = new Error(response.statusMessage);
      e.code = response.statusCode;
      reject(e);
    }
    // resolve(body);
    else resolve({ body: body, link: response.headers["link"] });
  }
}

async function ShopifyProxy(proxy_for, shop, accesstoken, url, bodydata, func) {
  return promiseRetry({ retries: 30, factor: 1.1 }, function(retry, number) {
    return proxy_for(shop, accesstoken, url, bodydata, func).catch(function(e) {
      // 410 Gone
      // 429 Too Many Requests
      // 500 Internal Server Error
      // 502 Bad Gateway
      // 504 Gateway Timeout
      // 524 A Timeout Occurred (Cloudflare)
      if ([410, 429, 500, 502, 503, 504, 524].includes(e.code)) {
        console.log(
          shop,
          func,
          e.code,
          e.code == 429 ? "API limit reached" : e.message,
          "- retrying (attempt",
          number,
          "of 30)"
        );
        retry(e);
      } else {
        console.error(shop, func, e.code, url);
        throw e;
      }
    });
  }).then(
    function(resolve_value) {
      if (func == "getShopifyObjectList") return resolve_value;
      // only return both body and link header for this function
      else return resolve_value.body;
    },
    function(e) {
      console.error(shop, func, e.code, e.message);
      throw e;
    }
  );
}

async function ShopifyGet(shop, accesstoken, url, bodydata, func) {
  return new Promise((resolve, reject) => {
    console.log(url.startsWith("https://") ? url : "https://" + shop + url);
    request.get(
      {
        url: url.startsWith("https://") ? url : "https://" + shop + url,
        headers: { "X-Shopify-Access-Token": accesstoken },
        json: true
      },
      function(error, response, body) {
        handleShopifyResponse(
          shop,
          func,
          error,
          response,
          body,
          resolve,
          reject
        );
      }
    );
  });
}
exports.subscribeWebhook = async (data, topic, url) => {
  const wh = {
    webhook: {
      topic: topic,
      address: forwardingAddress + url,
      format: "json"
    }
  };

  return ShopifyProxy(
    ShopifyPost,
    data.shop,
    data.access_token,
    `/admin/api/2020-07/webhooks.json`,
    wh,
    "subscribeWebhook"
  ).then(body => {
    return body.webhook;
  });
};



exports.getAccessToken = async (shop, code) => {
  return ShopifyProxy(
    ShopifyPost,
    shop,
    "",
    "/admin/oauth/access_token",
    {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code: code
    },
    "getAccessToken"
  ).then(body => {
    return body.access_token;
  });
  // .catch(err => { throw err });
};

exports.getWebhook = async data => {
  return ShopifyProxy(
    ShopifyGet,
    data.shop,
    data.access_token,
    `/admin/api/2020-10/webhooks.json`,
    null,
    "getWebhook"
  )
    .then(body => {
      return body.webhooks;
    })
    .catch(err => {
      return;
    }); // return no value on error, e.g. 404 if no charge on file
};

exports.getShopInfo = async data => {
  return ShopifyProxy(
    ShopifyGet,
    data.shop,
    data.access_token,
    `/admin/api/2021-01/shop.json`,
    null,
    "getShopInfo"
  )
    .then(body => {
      return body.shop;
    })
    .catch(err => {
      return;
    }); // return no value on error, e.g. 404 if no charge on file
};

exports.registerScript = async (data) => {
  const wh = {
    script_tag: {
      event: "onload",
      src: forwardingAddress + "/custom-script.js"
    }
  };
  
  return await ShopifyProxy(
    ShopifyPost,
    data.shop,
    data.access_token,
    `/admin/script_tags.json`,
    wh,
    "subscribeWebhook"
  ).then(body => {
    return body;
  });
};
