import React from "react";
import { Card, Layout, Page, List } from "@shopify/polaris";
import store from "store";

const shop = store.get("shop");

function Faq() {
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card title="FAQs">
            <Card.Section title="How does Gifted work?">
            Gifted allows online shoppers to send your store’s products as gifts through email using
              the <b>Gift This Item</b> button. Recipients will be redirected to the product page to select the
              product variant they prefer and enter their shipping address. The gift giver will then be
              notified to complete the standard checkout progress. You can learn more on our {" "}
              <a href="https://www.givewithgifted.com/" target="_blank">
                website.
              </a>
            </Card.Section>
             <Card.Section title="What if the “Gift This Item” button is not the size or color I prefer?">
             <p>You can copy the product page’s <b>add_to_cart</b> button class and paste it to <b>give_this_item/accept_gift</b> button’s class in your theme template file by following these instructions:</p>
             <br/>
             <List type="bullet">
                <List.Item>
                  Go to the {" "}
                  <a
                    href={`https://${shop}/admin/themes/current/?key=templates`}
                    target="_blank"
                  >
                  template file.
                  </a>
                </List.Item>
                 <List.Item>
                 Find and open the {" "}
                 <a
                    href={`https://${shop}/admin/themes/current/?key=templates`}
                    target="_blank"
                  >
                  product-template.liquid file 
                  </a> 

                </List.Item>
                <List.Item>
                   Using the Find shortcut (Ctrl+F) to search for the <b>name="add"</b> keyword in the <b>product-template.liquid </b>code 
                  and Now copy the product page <b>add_to_cart</b> button <b>class_name</b> 
                  <br/>
                  <code>{`
                    class="class_name". `}</code> 
                  

                  <img src="https://react90876.s3.amazonaws.com/chrome-capture+(1).jpg" style={{maxHeight:'100%',maxWidth:'100%',objectFit:'cover'}}/>
                </List.Item>
                <List.Item>
                Using the Find shortcut (Ctrl+F) to search for the <b>gift-now</b> keyword in the <b>product-template.liquid</b> and  Paste it to the <b>give_this_item/accept_gift</b> button's class in your theme template file.
                  <img src="https://react90876.s3.amazonaws.com/Screenshot_2.png" style={{maxHeight:'100%',maxWidth:'100%',objectFit:'cover'}}/>
                </List.Item>
                <List.Item>
                Save the template file for the change to be implemented.
                </List.Item>
             </List>
            </Card.Section>
            <Card.Section title="The Gifted button is not showing up, can you please help?">
             Please email us at {" "}
             <a href="mailto:info@givewithgifted.com" target="_blank">
                info@givewithgifted.com
              </a>
              {" "}
              and we will be happy to help troubleshoot.

            </Card.Section>
           

            <Card.Section title="What if my products are out of stock?">
              If your shoppers want to give a product that is out of stock or becomes out of stock prior
              to purchase, they are encouraged to contact us and we will work with you to ensure the
              gift giver has a chance to purchase the product once it is back in stock.
            </Card.Section>
            <Card.Section title="SWhich products are eligible to be gifted on my site?">
              When you place the Gifted button on your site, it will appear on all your product pages.
              As a result, all of your products are eligible to be gifted.
            </Card.Section>

            <Card.Section title="How can I retrieve information on gift givers and the recipients?">
              You will receive a report on all gifting activity conducted through Gifted once a month at
              your Shopify email address.

            </Card.Section>
            <Card.Section title="What emails will the gift givers and recipients receive?">
              The gift giver will receive a confirmation email that they have successfully sent the gift.
              The recipient will receive an email to open their gift. The gift giver will receive a final
              email to complete their purchase. You can see these emails by trying out Gifted on {" "}
              <a href="https://teamgifted.myshopify.com/" target="_blank">
                  our
              demo store.
              </a>
            </Card.Section>
            <Card.Section>
              Please send us your questions at {" "}
              <a href="mailto:info@givewithgifted.com" target="_blank">
                info@givewithgifted.com.
              </a>
            </Card.Section>   
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Faq;
