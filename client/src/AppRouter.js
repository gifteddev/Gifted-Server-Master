import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "@shopify/app-bridge-react";
import { Loading, Frame } from "@shopify/polaris";
import store from "store";

const Setting = lazy(() => import("./components/Setting"));
const Faq = lazy(() => import("./components/Faq"));
const NotFound = lazy(() => import("./components/404"));

const SHOPIFY_API_KEY = '6c30c2ecd899f0b8f17c3ae35220ba53';

const query = new URLSearchParams(window.location.search);
let shop = query.get("shop");
let hmac = query.get("hmac");

console.log(hmac, "hmac");
if (shop) {
  store.set("shop", shop);
}
if (hmac) {
  store.set("hmac", hmac);
}

shop = store.get("shop");
console.log(shop);
const config = {
  apiKey: SHOPIFY_API_KEY,
  shopOrigin: shop,
  // note: use shopOrigin: 'gifted.myshopify.com' 
  // forceRedirect: true
};

function AppRouter() {
  return (
    <Provider config={config} data-test="appRouter">
      <Router>
        <Suspense
          fallback={
            <div style={{ height: "100px" }}>
              <Frame>
                <Loading />
              </Frame>
            </div>
          }
        >
          <Switch>
            <Route exact path="/shopify" component={() => <Setting shop={shop}/>} />
            <Route exact path="/shopify/setting" component={() => <Setting shop={shop}/>} />
            <Route exact path="/shopify/faq" component={Faq} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default AppRouter;
