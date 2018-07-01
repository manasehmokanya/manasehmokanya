const express = require('express');
const bodyParser = require('body-parser');
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')


app.get('/', function (req, res) {
  res.render('index');
})
app.post('/', function (req, res) {
  let cfrom = req.body.currency-from;
  let cto = req.body.currency-to;
  let cnum = req.body.currency-num;
  
  let https = require('https');

function convertCurrency(amount, fromCurrency, toCurrency, cb) {
  //var cfrom = document.getElementById("currency-from");
   //var cto  = document.getElementById("currency-to");
   //var cnum = document.getElementById("currency-num");
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  let query = fromCurrency + '_' + toCurrency;

  let url = 'https://www.currencyconverterapi.com/api/v5/convert?q='+query;

  https.get(url, function(res){
      let body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          try {
            let jsonObj = JSON.parse(body);

            let val = jsonObj[query];
            if (val) {
              let total = val * amount;
              cb(null, Math.round(total * 100) / 100);
            } else {
              let err = new Error("Value not found for " + query);
              console.log(err);
              cb(err);
            }
          } catch(e) {
            console.log("Parse error: ", e);
            cb(e);
          }
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
        cb(e);
  });
}

convertCurrency(cnum, cfrom, cto, function(err, amount) {
  console.log(amount);
});
  res.render(cfrom + cto + cnum + "Submited successfully"); 
})
app.listen(3000, function () {
  console.log('Currency Converter app is listening on port 3000!')
})