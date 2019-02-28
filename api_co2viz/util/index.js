const fs = require('fs')
const xml2js = require('xml2js')
const R = require('ramda')

const parser = new xml2js.Parser()

const powerCountries = require('./../public/greatPowers.json')

const Filters = {
  COUNTRY: 'Country or Area',
  YEAR: 'Year',
  ITEM: 'Item',
  VALUE: 'Value',
  GREATPOWER: 'Great Power'
}

const parseByAttr = item => {
  return R.reduce(
    (obj, field) => {
      const attrs = field['$']
      const val = field['_']
      return { ...obj, [attrs.name]: { key: attrs.key, val: val } }
    },
    {},
    item.field
  )
}

const getRecords = url => {
  return new Promise((resolve, reject) => {
    fs.readFile(url, 'utf-8', function(error, text) {
      if (error) {
        reject(Error(error))
      } else {
        parser.parseString(text, (err, result) => {
          if (err) {
            reject(Error(err))
          }
          const records = result['Root']['data'][0]['record']
          const parsed = R.map(parseByAttr, records)
          resolve(parsed)
        })
      }
    })
  })
}

const getCountries = parsedArr => {
  const byCountry = R.groupBy(el => el[Filters.COUNTRY].key)
  const codeAndName = R.map(el => el[0][Filters.COUNTRY].val, byCountry(parsedArr))
  return codeAndName
}

const mergeData = (pData, eData) => {
  const merged = R.map(item => {
    const co2Data = R.find(x => x['Year'].val == item['Year'].val)(eData)
    return {
      [Filters.COUNTRY]: item[Filters.COUNTRY],
      [Filters.YEAR]: item[Filters.YEAR],
      population: {
        [Filters.ITEM]: item[Filters.ITEM],
        [Filters.VALUE]: item[Filters.VALUE]
      },
      co2: {
        [Filters.ITEM]: co2Data ? co2Data[Filters.ITEM] : undefined,
        [Filters.VALUE]: co2Data ? co2Data[Filters.VALUE] : undefined
      }
    }
  }, pData)
  return merged
}

const filterBy = (attr, parsedArr, value) => {
  return R.filter(el => {
    switch (attr) {
      case Filters.GREATPOWER: {
        return el[Filters.COUNTRY] && el[Filters.COUNTRY].key
          ? powerCountries.indexOf(el[Filters.COUNTRY].key) >= 0
          : false
      }
      case Filters.COUNTRY: {
        return el[attr] && el[attr].key ? el[attr].key.toLowerCase() === value.toLowerCase() : false
      }
      default: {
        return el[attr] && el[attr].val ? el[attr].val.toLowerCase() === value.toLowerCase() : false
      }
    }
  }, parsedArr)
}

module.exports = {
  getRecords,
  getCountries,
  mergeData,
  Filters,
  filterBy
}