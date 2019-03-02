import React, { Component } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/lib/animated'
import styled, { withTheme } from 'styled-components'
import { css } from '@emotion/core'
import { PacmanLoader } from 'react-spinners'

import CountryChart from './CountryChart'
import Checkbox from './styled/Checkbox'

const R = require('ramda')

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const CheckboxRow = styled.div`
  padding: 10px 0px;

  label {
    margin-right: 20px;
    margin-left: 5px;

    span {
      color: white;
      margin-left: 10px;
    }
  }
`

const DataWrapper = styled.div`
  background: ${props => props.theme.darkBG};
  position: relative;
`

const LoaderWrapper = styled.div`
  display: inline;
  position: absolute;
  top: 40%;
  left: 50%;
`

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: {},
      selectedCountries: [],
      countryData: {},
      perCapita: false,
      loading: false
    }
  }

  componentDidMount() {
    fetch('/api/countries')
      .then(response => {
        console.log(response)
        response.json()
      })
      .then(data => {
        this.setState({ countries: data })
      })
      .catch(e => {
        console.log(e)
      })
  }

  handleChange = newCountries => {
    const oldCountries = this.state.selectedCountries
    if (newCountries.length > oldCountries.length) {
      const newC = R.filter(x => !oldCountries.includes(x), newCountries)
      if (newC[0]) {
        this.fetchCountryData(newC[0].value)
      }
    } else {
      const oldC = R.filter(x => !newCountries.includes(x), oldCountries)
      if (oldC[0]) {
        this.setState({ countryData: { ...this.state.countryData, [oldC[0].value]: undefined } })
      }
    }
    this.setState({ selectedCountries: newCountries })
  }

  fetchCountryData = code => {
    this.setState({ loading: true })
    fetch(`/api/countryData?country=${code}`)
      .then(response => response.json())
      .then(data => {
        const countryStillSelected = R.find(R.propEq('value', code))(this.state.selectedCountries)
        if (countryStillSelected) {
          this.setState({
            loading: false,
            countryData: { ...this.state.countryData, [code]: data }
          })
        } else {
          this.setState({
            loading: false
          })
        }
      })
      .catch(e => {
        this.setState({ loading: false })
        console.error(e) // eorfsidkmcx
      })
  }

  parseForChart = countryData => {
    const { perCapita } = this.state
    const parsedForChart = {}
    Object.keys(this.state.countryData).forEach(key => {
      const cd = this.state.countryData[key]
      for (let x in cd) {
        const item = cd[x]
        const co2 = parseInt(item['co2']['Value'].val)
        const pop = parseInt(item['population']['Value'].val)
        const value = perCapita ? ((co2 / pop) * 1000).toFixed(3) : (co2 / 1000).toFixed(3)
        parsedForChart[item['Year'].val] = {
          ...parsedForChart[item['Year'].val],
          [item['Country or Area'].val]: value
        }
      }
    })
    const final = []
    Object.keys(parsedForChart).forEach(key => {
      const el = parsedForChart[key]
      final.push({ year: key, ...el })
    })
    return final
  }

  parseForSelect = countries => {
    return Object.keys(countries).map(key => ({ value: key, label: countries[key] }))
  }

  togglePerCapita = () => {
    this.setState({ perCapita: !this.state.perCapita })
  }

  render() {
    const parsedData = this.parseForChart(this.state.countryData)
    const parsedCountries = this.parseForSelect(this.state.countries)
    const yLabel = this.state.perCapita
      ? 'CO2 Emissions (kt) per 1000 Capita'
      : 'CO2 Emissions (Mt)'
    const unit = this.state.perCapita ? 'kt' : 'Mt'
    return (
      <ContentWrapper>
        <Select
          onChange={this.handleChange}
          isMulti
          name="countries"
          components={makeAnimated()}
          options={parsedCountries}
        />

        <CheckboxRow>
          <label>
            <Checkbox checked={this.state.perCapita} onChange={this.togglePerCapita} />
            <span>Per Capita</span>
          </label>

          <label>
            <Checkbox checked={this.state.withPCs} onChange={this.toggleWithPCs} />
            <span>Show Power Countries</span>
          </label>
        </CheckboxRow>

        <DataWrapper>
          <LoaderWrapper>
            <PacmanLoader
              sizeUnit={'px'}
              size={25}
              color={this.props.theme.accentColor}
              loading={this.state.loading}
            />
          </LoaderWrapper>

          <CountryChart data={parsedData} yLabel={yLabel} unit={unit} />
        </DataWrapper>
      </ContentWrapper>
    )
  }
}

export default withTheme(Home)
