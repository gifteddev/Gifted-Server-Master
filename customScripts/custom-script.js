const uri = "https://889bc696d829.ngrok.io";
let oReq = new XMLHttpRequest();
oReq.open("GET", `${uri}/shopify/settings?shop=${Shopify.shop}`);
oReq.addEventListener("load", () => {
    let shopData = JSON.parse(oReq.responseText);
    let product;
    if(document.getElementById("ProductJson-product-template")){
        product = JSON.parse(document.getElementById("ProductJson-product-template").innerHTML);
    }
    else{
        for( let j = 0 ; j < document.getElementsByTagName('script').length ; j++){
            if(document.getElementsByTagName('script')[j].type == "application/json"){
                if(document.getElementsByTagName('script')[j].hasAttribute("data-product-json")){
                    product = JSON.parse(document.getElementsByTagName('script')[j].innerHTML);
                }
            }
        }
    }
    let buttons = document.getElementsByTagName('button');
    for(let i = 0 ; i < buttons.length ; i++){
        let button = buttons[i];
        if(button.getAttribute('type') == 'submit' && button.getAttribute('name') == 'add'){
            let classList = button.getAttribute('class');
            button.parentNode.innerHTML += `
                <div id="gifted" data-id="${product.id}" data-url="/products/${product.handle}" data-name="${product.title}" data-color="${shopData.is_customized?shopData.modal_color:'#4a90e2'}" data-shopname="${product.vendor}">
                    <button class="` + classList + `" type="button" style="display:none;" id="gift-now">Gift This Item</button>
                    <button class="` + classList + `" type="button" style="display:none;background-color: #1faddb;color:#ffffff;" id="accept-gift">Accept Gift</button>
                </div>   
                <div id="app-gary"></div>
                <div id="app-rachel"></div>
            `;
        }
    }
    var scriptElm = document.createElement('script');
    scriptElm.src = 'https://gifted-script.s3.amazonaws.com/app.js';
    document.body.appendChild(scriptElm);
    if(shopData.is_customized){
        document.getElementById("gift-now").style.color=shopData.font_color;
        document.getElementById("gift-now").style.backgroundColor=shopData.background_color;
        document.getElementById("gift-now").style.fontFamily=shopData.font_family;
    }
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = '1';
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://gifted-script.s3.amazonaws.com/app.css';
    link.media = 'all';
    head.appendChild(link);
    var scriptElm2 = document.createElement('script');
    scriptElm2.src = 'https://rachel-client.s3.amazonaws.com/app.js';
    document.body.appendChild(scriptElm2);
    var link2  = document.createElement('link');
    link2.id   = '1';
    link2.rel  = 'stylesheet';
    link2.type = 'text/css';
    link2.href = 'https://rachel-client.s3.amazonaws.com/app.css';
    link2.media = 'all';
    head.appendChild(link2);
});
oReq.send();
