import React, { Component } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  Legend
} from 'recharts'
import styled, { withTheme } from 'styled-components'

const ChartWrapper = styled.div`
  background: ${props => props.theme.primaryColorDark + '8C'};
  pointer-events: ${props => (props.disable ? 'none' : 'auto')};
`

const coolColors = [
  '#fff59d',
  '#ffab91',
  '#c5e1a5',
  '#80deea',
  '#b39ddb',
  '#eeeeee',
  '#ef5350',
  '#9c27b0',
  '#1e88e5',
  '#43a047'
]

class CountryChart extends Component {
  render() {
    const { data, yLabel } = this.props

    return (
      <ChartWrapper disable={data.length === 0}>
        <ResponsiveContainer height={350}>
          <LineChart data={data} margin={{ top: 50, left: 30, bottom: 50, right: 50 }}>
            {data &&
              data[0] &&
              Object.keys(data[0])
                .filter(key => key !== 'year')
                .map((key, i) => {
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dot={false}
                      dataKey={key}
                      stroke={coolColors[i % coolColors.length]}
                    />
                  )
                })}
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="year" tick={{ fill: 'white' }} height={40} />
            <YAxis width={100} tick={{ fill: 'white' }} name="CO2 emissions" unit="kt">
              <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
                {yLabel}
              </Label>
            </YAxis>
            <Legend />
            <Tooltip
              contentStyle={{ background: this.props.theme.primaryColorDark, color: 'white' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    )
  }
}

export default withTheme(CountryChart)
