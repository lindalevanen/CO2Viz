const fs = require('fs');
var xml2js = require('xml2js');
const R = require('ramda');

const parser = new xml2js.Parser();

const powerCountries = require("./../public/greatPowers.json")

Filters = {
  COUNTRY : 'Country or Area',
  YEAR : 'Year',
  GREATPOWER : 'Great Power'
}

function parseByAttr(item) {
  return (
    R.reduce((obj, field) => {
      const attrs = field['$']
      const val = field['_']
      return (
        {...obj, [attrs.name]: {key: attrs.key, val: val} }
      )
    }, {}, item.field)
  )
}

function getRecords(url, callback) {
  fs.readFile(url, "utf-8", function (error, text) {
    if (error) {
      throw error;
    } else {
      parser.parseString(
        text,
        function (err, result) {
          const records = result['Root']['data'][0]['record'];
          const parsed = R.map(parseByAttr, records);
          callback(parsed)
      });
    }
  });
}

function getCountries(parsedArr) {
  const byCountry = R.groupBy(el => el[Filters.COUNTRY].key)
  const codeAndName = R.map(el => el[0][Filters.COUNTRY].val,
    byCountry(parsedArr)
  )
  return codeAndName
}

function mergeData(pData, eData) {
  const merged = R.map(item => {
    const co2Data = R.find(x => x['Year'].val == item['Year'].val)(eData)
    return (
      {
        ['Country or Area']: item['Country or Area'],
        ['Year']: item['Year'],
        population: {
          ['Item']: item['Item'],
          ['Value']: item['Value']
        } ,
        co2: {
          ['Item']: co2Data ? co2Data['Item'] : undefined,
          ['Value']: co2Data ? co2Data['Value'] : undefined
        } 
      }
    )
  }, pData)
  return merged
}

function filterBy(attr, parsedArr, value) {
  return (
    R.filter(
      el => {
        switch(attr) {
          case Filters.GREATPOWER: {
            return ( el[Filters.COUNTRY] && el[Filters.COUNTRY].key ? powerCountries.indexOf(el[Filters.COUNTRY].key) >= 0 : false )
          }
          case Filters.COUNTRY: {
            return ( el[attr] && el[attr].key ? el[attr].key.toLowerCase() === value.toLowerCase() : false )
          }
          default: {
            return ( el[attr] && el[attr].val ? el[attr].val.toLowerCase() === value.toLowerCase() : false )
          }
        }

      },
    parsedArr)
  )
}

module.exports = {
  parseXML: getRecords,
  filterBy,
  getCountries,
  mergeData,
  Filters,
}