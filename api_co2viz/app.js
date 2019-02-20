var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var populationRouter = require('./routes/population');
//var emissionsRouter = require('./routes/emissions');

const emissionsXML = __dirname + "/public/xmlfiles/API_EN.ATM.CO2E.KT_DS2_en_xml_v2_10474794.xml";
const populationXML = __dirname + "/public/xmlfiles/API_SP.POP.TOTL_DS2_en_xml_v2_10473997.xml";

const Helpers = require('./util')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/population', populationRouter);
//app.use('/emissions', emissionsRouter);

app.get('/', function(req, res, next) {
  res.send('Hello world!');
})

app.get('/api/emissions', function(req, res, next) {
  Helpers.parseXML(emissionsXML, function(records) {
    var data = filterData(records, req.query)
    res.send(JSON.stringify(data));
  });
});

app.get('/api/population', function(req, res, next) {
  Helpers.parseXML(populationXML, function(records) {
    var data = filterData(records, req.query)
    res.send(JSON.stringify(data));
  });
});

app.get('/api/countries', function(req, res, next) {
  Helpers.parseXML(populationXML, function(records) {
    var data = Helpers.getCountries(records)
    console.log(data)
    res.send(JSON.stringify(data));
  });
})

function filterData(data, query) {
  const { country, year, greatPowerCountries } = query
  var fData = data
  if (country) {
    fData = Helpers.filterBy(Helpers.Filters.COUNTRY, data, country)
  }
  if (year) {
    fData = Helpers.filterBy(Helpers.Filters.YEAR, data, year)
  }
  if (greatPowerCountries) {
    fData = Helpers.filterBy(Helpers.Filters.GREATPOWER, data)
  }
  return fData
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
