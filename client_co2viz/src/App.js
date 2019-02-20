import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: {},
      selectedCountry: 'defVal',
      countryData: []
    }
  }

  componentDidMount() {
    fetch('/api/countries')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ countries: data })
      });
  }

  renderOption = (country, code) => {
    return (
      <option key={code} value={code}>{country}</option>
    )
  }

  handleChange = (e) => {
    console.log(e.target.value)
    this.setState({selectedCountry: e.target.value});
    this.fetchCountryData(e.target.value)
  }

  fetchCountryData = (code) => {
    fetch(`/api/emissions?country=${code}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ countryData: data })
      });
  }

  renderLI = (el) => {
    return ( <li>{"Year: " + el['Year'].val + "   " + el['Item'].val + ": " + el['Value'].val}</li> )
  }
  
  render() {
    console.log(this.state.countryData)
    return (
      <div>
        <select
          onChange={this.handleChange}
          value={this.state.selectedCountry}
        >
          <option key={'default'} value="defVal">Choose a coutry to view</option>
          {this.state.countries &&
            Object.keys(this.state.countries).map((key) => {
              return (
                this.renderOption(this.state.countries[key], key)
              )
            })
          }
        </select>

        <ul>
          {this.state.countryData &&
            this.state.countryData.map((el) => {
              return (
                this.renderLI(el)
              )
            })
          }
        </ul>
        
      </div>
    );
  }
}

export default App;
