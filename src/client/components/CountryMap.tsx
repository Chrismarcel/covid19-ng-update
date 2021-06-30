import React, { useState, memo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { slugifyStr, generateChloropheth, formatNumber } from '../../utils'
import ReactTooltip from 'react-tooltip'
import MapLegends from './MapLegends'
import mapOfNigeria from '../map/map-of-nigeria.json'
import { DataKey } from '../../constants'
import CasesDropdown from './CasesDropdown'
import { Stats } from './Dashboard'

const CountryMap = ({ stats }: { stats: Stats }) => {
  const [stateName, setStateName] = useState('')
  const [dataKey, setDataKey] = useState(DataKey.CONFIRMED_CASES)
  const slug = stateName === 'Federal Capital Territory' ? 'fct' : slugifyStr(stateName)

  return (
    <section className="map-container panel">
      <div className="dropdown-wrapper">
        <CasesDropdown onChange={({ value }) => setDataKey(value)} />
      </div>
      <ComposableMap
        className="map-svg-wrapper"
        data-tip
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-8.5, -8.5, 0],
          scale: 3000,
        }}>
        <Geographies geography={mapOfNigeria}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const { properties } = geo
              const { name } = properties

              const stateName: string =
                name === 'Federal Capital Territory' ? 'fct' : slugifyStr(name)
              const numCases: number = stats[stateName][dataKey] || 0

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  role="region"
                  fill={generateChloropheth(numCases)}
                  stroke="#008751"
                  strokeWidth={0.7}
                  onMouseEnter={() => setStateName(name)}
                  onMouseLeave={() => setStateName('')}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      <MapLegends />
      {stateName && (
        <ReactTooltip place="bottom">
          <p>{stateName}</p>
          <br />
          <p>Confirmed: {formatNumber(stats[slug][DataKey.CONFIRMED_CASES])}</p>
          <p>Active: {formatNumber(stats[slug][DataKey.ACTIVE_CASES])}</p>
          <p>Discharged: {formatNumber(stats[slug][DataKey.DISCHARGED])}</p>
          <p>Deaths: {formatNumber(stats[slug][DataKey.DEATHS])}</p>
        </ReactTooltip>
      )}
    </section>
  )
}

export default memo(CountryMap)
