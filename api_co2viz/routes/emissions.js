const express = require('express');
const R = require('ramda');
const Helpers = require('../util')

const router = express.Router();
const emissionsXML = __dirname + "/../public/xmlfiles/API_EN.ATM.CO2E.KT_DS2_en_xml_v2_10474794.xml";
//var populationXML = __dirname + "/../public/xmlfiles/bookstore.xml";

router.get('/', function(req, res, next) {
    const { country, year, greatPowerCountries } = req.query
    console.log(greatPowerCountries)
    Helpers.parseXML(emissionsXML, function(records) {
      var data = records
      if (country) {
        data = Helpers.filterBy(Helpers.Filters.COUNTRY, data, country)
      }
      if (year) {
        data = Helpers.filterBy(Helpers.Filters.YEAR, data, year)
      }
      if (greatPowerCountries) {
        data = Helpers.filterBy(Helpers.Filters.GREATPOWER, data)
      }
      res.send(JSON.stringify(data));
    });
});

module.exports = router;

