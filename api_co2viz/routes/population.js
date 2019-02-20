const express = require('express');
const R = require('ramda');
const Helpers = require('../util')

const router = express.Router();
const populationXML = __dirname + "/../public/xmlfiles/API_SP.POP.TOTL_DS2_en_xml_v2_10473997.xml";
//var populationXML = __dirname + "/../public/xmlfiles/bookstore.xml";

router.get('/', function(req, res, next) {
  const { country, year } = req.query
  Helpers.parseXML(populationXML, function(records) {
    var data = records
    if (country) {
      data = Helpers.filterBy('Country or Area', data, country)
    }
    if (year) {
      data = Helpers.filterBy('Year', data, year)
    }
    //res.render('index', { data: data });
    console.log(data)
    res.send(JSON.stringify(data));
  });
});

module.exports = router;