const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const emissionsXML = __dirname + '/public/xmlfiles/API_EN.ATM.CO2E.KT_DS2_en_xml_v2_10474794.xml'
const populationXML = __dirname + '/public/xmlfiles/API_SP.POP.TOTL_DS2_en_xml_v2_10473997.xml'

const Helpers = require('./util')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res, next) => {
  res.send('Hello world!')
})

app.get('/api/countryData', (req, res, next) => {
  Helpers.getRecords(populationXML)
    .then(records => {
      pRecords = records
      return Helpers.getRecords(emissionsXML)
    })
    .then(records => {
      eRecords = records
      const pData = filterData(pRecords, req.query)
      const eData = filterData(eRecords, req.query)
      const mergedData = Helpers.mergeData(pData, eData)
      res.status(200).send(JSON.stringify(mergedData))

    }).catch(e => {
      console.log(e)
    })
})

app.get('/api/countries', (req, res, next) => {
  Helpers.getRecords(populationXML)
    .then(records => {
      const data = Helpers.getCountries(records)
      res.status(200).send(JSON.stringify(data))
    })
    .catch(error => {
      console.log(error)
      res.status(500).send({ message: error })
    })
})

const filterData = (data, query) => {
  const { country, year, greatPowerCountries } = query
  var fData = data
  if (country) {
    fData = Helpers.filterBy(Helpers.Filters.COUNTRY, fData, country)
  }
  if (year) {
    fData = Helpers.filterBy(Helpers.Filters.YEAR, fData, year)
  }
  if (greatPowerCountries) {
    fData = Helpers.filterBy(Helpers.Filters.GREATPOWER, fData)
  }
  return fData
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
