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
import { generatePieChartsData, reverseSlug, toSentenceCase, PieChartStats } from '../../utils'
import { DataKey } from '../../constants'
import { ColorSchemeContext } from '../context'
import CasesDropdown from './CasesDropdown'
import { StatsData } from '~/server/scraper'

interface LineChartStats {
  [key: string]: string
}

const mergeStatsWithState = (stats: StatsData) => {
  const mergedData: LineChartStats[] = []
  Object.entries(stats).forEach(([state, data]) => {
    const stateName = state !== 'fct' ? reverseSlug(state) : 'F.C.T'
    if (state !== 'total') {
      mergedData.push({
        state: toSentenceCase(stateName),
        'Confirmed cases': `${data[DataKey.CONFIRMED_CASES]}`,
        'Active cases': `${data[DataKey.ACTIVE_CASES]}`,
        Discharged: `${data[DataKey.DISCHARGED]}`,
        Deaths: `${data[DataKey.DEATHS]}`,
      })
    }
  })

  return mergedData.sort((a, b) => a.state.localeCompare(b.state))
}

export const LineChart = ({ stats }: { stats: StatsData }) => {
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

interface TooltipProps {
  label: number
  value: number
  data: { value: number; text: string; color: string }[]
  total: number
}

const formatTooltip = ({ label, value, data, total }: TooltipProps) => {
  const toPercentage = (value / total) * 100
  const tooltipLabel = data[label].text
  const tooltipValue = `${label} (${toPercentage.toFixed(2)}%)`
  return [tooltipValue, `${tooltipLabel} cases`]
}

export const PieChart = ({ stats }: { stats: PieChartStats }) => {
  const [dataKey, setDataKey] = useState(DataKey.CONFIRMED_CASES)
  const { data, total } = generatePieChartsData({ stats, dataKey })

  return (
    <div className="panel chart-wrapper pie-chart">
      <div className="dropdown-wrapper">
        <CasesDropdown onChange={({ value }) => setDataKey(value as DataKey)} />
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
            <Tooltip
              formatter={(value: number, label: number) =>
                formatTooltip({ value, label, data, total })
              }
            />
          </RPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
