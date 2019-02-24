import React, { Component } from 'react';
import Select from 'react-select'
import makeAnimated from 'react-select/lib/animated';
import styled from 'styled-components'

import CountryChart from './CountryChart'

const R = require('ramda');

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`

const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
)

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${props => props.checked ? props.theme.accentColor : 'white'};
  border-radius: 3px;
  transition: all 150ms;

  ${Icon} {
    visibility: ${props => props.checked ? 'visible' : 'hidden'};
  }
`

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`

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
      margin-left: 10px;
    }
  }
  
`

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: {},
      selectedCountries: [],
      countryData: {},
      perCapita: false
    }
  }

  componentDidMount() {
    fetch('/api/countries')
      .then(response => response.json())
      .then(data => {
        this.setState({ countries: data })
      }).catch(function(e) {
        console.log(e);
      });
  }

  handleChange = (newCountries) => {
    const oldCountries = this.state.selectedCountries
    if(newCountries.length > oldCountries.length) {
      const newC = R.filter(x => !(oldCountries.includes(x)), newCountries)
      if(newC[0]) {
        this.fetchCountryData(newC[0].value)
      }
    } else {
      const oldC = R.filter(x => !(newCountries.includes(x)), oldCountries)
      if(oldC[0]) {
        this.setState({countryData: {...this.state.countryData, [oldC[0].value]: undefined}})
      }
    }
    this.setState({selectedCountries: newCountries});
  }

  fetchCountryData = (code) => {
    fetch(`/api/countryData?country=${code}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ countryData: {...this.state.countryData, [code]: data} })
      });
  }

  parseForChart = (countryData) => {
    const { perCapita } = this.state
    const parsedForChart = {}
    Object.keys(this.state.countryData).forEach(key => {
      const cd = this.state.countryData[key]
      for(let x in cd) {
        const item = cd[x]
        const co2 = parseInt(item['co2']['Value'].val)
        const pop = parseInt(item['population']['Value'].val)
        const value = perCapita ? (co2 / pop * 1000).toFixed(3)
          : (co2 / 1000).toFixed()
        parsedForChart[item['Year'].val] = {
          ...parsedForChart[item['Year'].val], 
          [item['Country or Area'].val]: value
        }
      }
    })
    const final = []
    Object.keys(parsedForChart).forEach(key => {
      const el = parsedForChart[key]
      final.push({year: key, ...el})
    })
    return final
  }

  parseForSelect = (countries) => {
    return ( 
      Object.keys(countries).map(key =>
        ({ value: key, label: countries[key] })
    ))
  }

  togglePerCapita = () => {
    this.setState({perCapita: !this.state.perCapita})
  }

  render() {
    const parsedData = this.parseForChart(this.state.countryData)
    const parsedCountries = this.parseForSelect(this.state.countries)
    const yLabel = this.state.perCapita ? 'CO2 Emissions (kt) per 1000 Capita' : 'CO2 Emissions (kt)'
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
            <Checkbox
              checked={this.state.perCapita}
              onChange={this.togglePerCapita}
            />
            <span>Per Capita</span>
          </label>

          <label>
            <Checkbox
              checked={this.state.withPCs}
              onChange={this.toggleWithPCs}
            />
            <span>Show Power Countries</span>
          </label>
        </CheckboxRow>
        

        <CountryChart data={parsedData} yLabel={yLabel} unit={unit} /> 

      </ContentWrapper>
    )
  }
}

export default Home;
