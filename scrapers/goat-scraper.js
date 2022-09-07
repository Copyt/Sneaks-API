const got = require("got");
const request = require("request");

module.exports = {
  getLink: async function (shoe, callback) {
    try {
      const response = await got.post(
        "https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1%3Breact%20(16.9.0)%3Breact-instantsearch%20(6.2.0)%3BJS%20Helper%20(3.1.0)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15",
            "Content-Type": "application/json",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          },
          body:
            '{"requests":[{"indexName":"product_variants_v2","params":"distinct=true&maxValuesPerFacet=1&page=0&query=' +
            shoe.styleID +
            '&facets=%5B%22instant_ship_lowest_price_cents"}]}',
          http2: true,
        }
      );
      var json = JSON.parse(response.body);
      if (json.results[0].hits[0]) {
        if (json.results[0].hits[0].lowest_price_cents_usd / 100 != 0) {
          shoe.lowestResellPrice.goat =
            json.results[0].hits[0].lowest_price_cents_usd / 100;
        }
        shoe.resellLinks.goat =
          "http://www.goat.com/sneakers/" + json.results[0].hits[0].slug;
        shoe.goatProductId = json.results[0].hits[0].product_template_id;
      }
      callback();
    } catch (error) {
      let err = new Error(
        "Could not connect to Goat while searching '" +
          shoe?.styleID +
          "' Error: " +
          error
      );
      console.log(err);
      callback(err);
    }
  },

  getPrices: async function (shoe, callback) {
    if (!shoe.resellLinks.goat) {
      callback();
    } else {
      // let apiLink = shoe.resellLinks.goat.replace('sneakers/', 'web-api/v1/product_variants?productTemplateId=');
      let apiLink = `http://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${shoe.goatProductId}`;
      let priceMap = {};

      try {
        const response = await got(apiLink, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
            "Content-Type": "application/json",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            cookie:
              '_csrf=zR6nkJahBogookk3IkLhkFe3; country=PH; currency=USD; global_pricing_regions={"AT":"2","BE":"2","BG":"2","CY":"2","CZ":"2","DE":"2","DK":"2","EE":"2","ES":"2","FI":"2","FR":"2","GR":"2","HK":"223","HR":"2","HU":"2","IE":"2","IT":"2","JP":"57","LT":"2","LU":"2","LV":"2","MT":"2","NL":"2","PL":"2","PT":"2","RO":"2","SE":"2","SG":"106","SI":"2","SK":"2","UK":"4","US":"3"}; ConstructorioID_client_id=5263cfc9-0936-4f32-afb5-cf8ebd325e18; ConstructorioID_session_id=1; _gid=GA1.2.146221660.1661506665; _gcl_au=1.1.1345759417.1661506666; _scid=f94559b2-f255-4b74-bf8a-2e096f2a3d4c; _tt_enable_cookie=1; _ttp=3a9307e1-fc5e-476d-9d0f-5b48c7f2c9d1; IR_gbd=goat.com; IR_12522=1661506665990%7C0%7C1661506665990%7C%7C; ConstructorioID_session={"sessionId":1,"lastTime":1661506725317}; _ga_28GTCC4968=GS1.1.1661506665.1.1.1661506725.0.0.0; _ga=GA1.1.920569677.1661506665; OptanonConsent=isIABGlobal=false&datestamp=Fri+Aug+26+2022+17%3A38%3A45+GMT%2B0800+(Philippine+Standard+Time)&version=6.10.0&hosts=&consentId=bd9916b6-5d60-4946-8456-dc47631b7a35&interactionCount=1&landingPath=https%3A%2F%2Fwww.goat.com%2Fweb-api%2Fv1%2Fproduct_variants%3FproductTemplateId%3Dair-jordan-1-low-reverse-black-toe-553558-163&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1; __cf_bm=lFlElevS79NlsRKjehwP6GkB.Kc4p3V5POcXVmxBHNo-1661507646-0-AbpWFyMczZRmtQYyPXP4Erv7XnnuVq+33VUFZJQox+rIeqgbKj0tlBgpR36yX5NZeW1sByDZzVB02FeMxh/+9ds=; csrf=oJ3gcvAO-A4a4puaBOEc-nX4eAeDr4aOzbrE',
            "if-none-match": 'W/"35ab-OpGtteX5sQNhnfbjH721YEuc35w"',
            "sec-ch-ua":
              '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "macOS",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
          },

          http2: true,
        });
        var json = JSON.parse(response.body);
        for (var i = 0; i < json.length; i++) {
          if (json[i].shoeCondition == "used") continue;
          if (priceMap[json[i].size]) {
            priceMap[json[i].size] =
              json[i].lowestPriceCents.amount / 100 < priceMap[json[i].size]
                ? json[i].lowestPriceCents.amount / 100
                : priceMap[json[i].size];
          } else {
            priceMap[json[i].size] = json[i].lowestPriceCents.amount / 100;
          }
        }
        shoe.resellPrices.goat = priceMap;
        // console.log("goat price", priceMap);
        callback();
      } catch (error) {
        console.log(error);
        let err = new Error(
          "Could not connect to Goat while searching '" +
            shoe?.styleID +
            "' Error: " +
            error
        );
        // console.log(err);
        callback(err);
      }
    }
  },

  getPictures: async function (shoe, callback) {
    if (!shoe.resellLinks.goat) {
      callback();
    } else {
      let apiLink = shoe.resellLinks.goat.replace(
        "sneakers",
        "web-api/v1/product_templates"
      );
      try {
        const response = await got(apiLink, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15",
            "Content-Type": "application/json",
          },
          http2: true,
        });
        var json = JSON.parse(response.body);
        if (json.productTemplateExternalPictures) {
          if (json.productTemplateExternalPictures[0]) {
            shoe.imageLinks.push(
              json.productTemplateExternalPictures[0].mainPictureUrl
            );
          }
          if (json.productTemplateExternalPictures[2]) {
            shoe.imageLinks.push(
              json.productTemplateExternalPictures[2].mainPictureUrl
            );
          }
          if (json.productTemplateExternalPictures[5]) {
            shoe.imageLinks.push(
              json.productTemplateExternalPictures[5].mainPictureUrl
            );
          }
          if (json.productTemplateExternalPictures[7]) {
            shoe.imageLinks.push(
              json.productTemplateExternalPictures[7].mainPictureUrl
            );
          }
          if (json.productTemplateExternalPictures[3]) {
            shoe.imageLinks.push(
              json.productTemplateExternalPictures[3].mainPictureUrl
            );
          }
        }
        callback(shoe);
      } catch (error) {
        let err = new Error(
          "Could not connect to Goat while grabbing pictures for '" +
            shoe?.styleID +
            "' Error: " +
            error
        );
        console.log(err);
        callback(err);
      }
    }
  },
};
