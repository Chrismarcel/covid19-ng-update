import React from 'react'
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
} from 'recharts'
import { generatePieChartsData, reverseSlug, toSentenceCase } from '../../server/utils'
import { DATA_KEYS } from '../constants'

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

  return (
    <div className="panel chart-wrapper line-chart">
      <ResponsiveContainer width="100%" height={400}>
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
          <Line type="monotone" dataKey="Confirmed cases" stroke="#1a1b25" />
          <Line type="monotone" dataKey="Active cases" stroke="#757166" />
          <Line type="monotone" dataKey="Discharged" stroke="#1a68e6" />
          <Line type="monotone" dataKey="Death" stroke="#e24e1b" />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  )
}

const formatTooltip = (value, label, { data, total }) => {
  const toPercentage = (value / total) * 100
  const tooltipLabel = data[label].text
  const tooltipValue = `${value} (${toPercentage.toFixed(2)}%)`
  return [tooltipValue, `${tooltipLabel} cases`]
}

export const PieChart = ({ stats }) => {
  const { data, total } = generatePieChartsData(stats)

  return (
    <div className="panel chart-wrapper pie-chart">
      <ResponsiveContainer>
        <RPieChart width="100%" height={400}>
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
          <Tooltip
            formatter={(value, label) => formatTooltip(value, label, { data, total })}
          />
        </RPieChart>
      </ResponsiveContainer>
    </div>
  )
}
