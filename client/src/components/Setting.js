import React from "react";
import {
  Card,
  Layout,
  Page,
  Button,
} from "@shopify/polaris";
import DEFAULT_SHOP_SETTING from "../AppConstants";
// import Preview from "./Preview";
import copy from "copy-to-clipboard";
import store from "store";
import FontPicker from "font-picker-react";
import axios from "axios";

import { SketchPicker } from "react-color";
import Axios from "axios";

const uri = "https://889bc696d829.ngrok.io";

class Setting extends React.Component {

  state = DEFAULT_SHOP_SETTING;

  loadShopData = () => {
    axios.get(`${uri}/shopify/settings?shop=${this.props.shop}`)
    .then(res => {
      const shopData = res.data;
      this.setState({
        modal: shopData.modal_color,
        background: shopData.background_color,
        font: shopData.font_color,
        activeFontFamily: shopData.font_family
      });
    });
  }

  componentDidMount(){
    this.loadShopData();
  }  

  updateShopData = () => {
    axios.post(`${uri}/shopify/settings`, {
      modal: this.state.modal,
      background: this.state.background,
      font: this.state.font,
      activeFontFamily: this.state.activeFontFamily,
      shop: this.props.shop,
    }).then(res => {
      this.loadShopData();
    }).catch(error => console.log(error));
  }

  handleChangeModalColor = color => {
    this.setState({ modal: color.hex });
    this.updateShopData();
  };

  handleChangeBackgroundColor = color => {
    this.setState({ background: color.hex });
    this.updateShopData();
  };

  handleChangeFontColor = color => {
    this.setState({ font: color.hex });
    this.updateShopData();
  };

  handleChangeFontFamily = nextFont => {
    this.setState({
      activeFontFamily: nextFont.family,
    });
    this.updateShopData();
  }

  handleDefault = () => {
    axios.post(`${uri}/shopify/default`, {
      shop: this.props.shop,
    }).then(res => {
      alert("Success");
    }).catch(error => console.log(error));
  }

  render() {
    return (
      <Page fullWidth>
        <Layout>
          <Layout.Section oneThird>
            <Card sectioned title="Select Modal Color">
              <Card.Section>
                <SketchPicker
                  color={this.state.modal}
                  onChangeComplete={this.handleChangeModalColor}
                />
              </Card.Section>
              {/* <Preview color={this.state.background} /> */}
            </Card>
          </Layout.Section>
          <Layout.Section oneThird>
            <Card sectioned title="Select Background Color">
              <Card.Section>
                <SketchPicker
                  color={this.state.background}
                  onChangeComplete={this.handleChangeBackgroundColor}
                />
              </Card.Section>
              {/* <Preview color={this.state.background} /> */}
            </Card>
          </Layout.Section>
          <Layout.Section oneThird>
            <Card sectioned title="Select Font Color">
              <Card.Section>
                <SketchPicker
                  color={this.state.font}
                  onChangeComplete={this.handleChangeFontColor}
                />
              </Card.Section>
              {/* <Preview color={this.state.background} /> */}
            </Card>
          </Layout.Section>
        </Layout>
        <div>&nbsp;</div>
        <Layout>
          <Layout.Section oneThird>
            <Card sectioned title="Select Font Family">
              <Card.Section>
                <div style={{display:'flex'}}>
                  <FontPicker
                    apiKey="AIzaSyAubyr9R4fOeSLn8f8ZJE3dspxu9CGeaRY"
                    activeFontFamily={this.state.activeFontFamily}
                    onChange={this.handleChangeFontFamily}
                  />
                  <p className="apply-font" style={{marginTop: 6, marginLeft: 20}}>GIFT THIS ITEM</p>
                </div>
                <div style={{display: 'flex', marginTop:20}}>
                  <p style={{marginTop:10, marginRight:30}}>Do you want default button?</p>
                  <Button primary onClick={this.handleDefault}>Use Default Style</Button>
                </div>
              </Card.Section>
              {/* <Preview color={this.state.background} /> */}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Setting;
