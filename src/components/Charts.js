import React, { useContext, useState } from 'react'
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { generatePieChartsData, reverseSlug, toSentenceCase } from '../../src/utils'
import { DATA_KEYS } from '../constants'
import { ColorSchemeContext } from '../context'
import CasesDropdown from './CasesDropdown'

const mergeStatsWithState = (stats) => {
  const mergedData = []
  Object.entries(stats).forEach(([state, data]) => {
    const stateName = state !== 'fct' ? reverseSlug(state) : 'F.C.T'
    if (state !== 'total') {
      mergedData.push({
        state: toSentenceCase(stateName),
        'Confirmed cases': data[DATA_KEYS.CONFIRMED_CASES],
        'Active cases': data[DATA_KEYS.ACTIVE_CASES],
        Discharged: data[DATA_KEYS.DISCHARGED],
        Deaths: data[DATA_KEYS.DEATHS],
      })
    }
  })

  return mergedData.sort((a, b) => a.state.localeCompare(b.state))
}

export const LineChart = ({ stats }) => {
  const data = mergeStatsWithState(stats)
  const { darkModeEnabled } = useContext(ColorSchemeContext)

  return (
    <div className="panel chart-wrapper line-chart">
      <div className="scrollable-container">
        <ResponsiveContainer height={400}>
          <RLineChart data={data} margin={{ right: 10, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              tick={{ fontSize: 12 }}
              dataKey="state"
              angle={-90}
              textAnchor="end"
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ bottom: -10 }} />
            <Line
              type="monotone"
              dataKey="Confirmed cases"
              stroke={darkModeEnabled ? '#e4e5e7' : '#1a1b25'}
            />
            <Line type="monotone" dataKey="Active cases" stroke="#757166" />
            <Line type="monotone" dataKey="Discharged" stroke="#1a68e6" />
            <Line type="monotone" dataKey="Deaths" stroke="#e24e1b" />
          </RLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const formatTooltip = ({ value, index, data, total }) => {
  const toPercentage = (value / total) * 100
  const tooltipLabel = data[index].text
  const tooltipValue = `${value} (${toPercentage.toFixed(2)}%)`
  return [tooltipValue, `${tooltipLabel} cases`]
}

export const PieChart = ({ stats }) => {
  const [dataKey, setDataKey] = useState(DATA_KEYS.CONFIRMED_CASES)
  const { data, total } = generatePieChartsData({ stats, dataKey })

  return (
    <div className="panel chart-wrapper pie-chart">
      <div className="dropdown-wrapper">
        <CasesDropdown onChange={({ value }) => setDataKey(value)} />
      </div>
      <div className="pie-chart-wrapper">
        <ResponsiveContainer height={400}>
          <RPieChart margin={{ top: -30 }}>
            <Legend
              iconType="circle"
              wrapperStyle={{ bottom: 40 }}
              formatter={(index) => <span className="pie-chart-legend">{data[index].text}</span>}
            />
            <Pie
              data={data}
              innerRadius="55%"
              outerRadius="70%"
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value">
              {data.map((_, index) => (
                <Cell key={data[index].color} fill={data[index].color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, index) => formatTooltip({ value, index, data, total })} />
          </RPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
