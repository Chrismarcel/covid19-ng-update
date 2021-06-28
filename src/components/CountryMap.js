import React, { useState, memo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { slugifyStr, generateChloropheth, formatNumber } from '../../src/utils'
import ReactTooltip from 'react-tooltip'
import MapLegends from './MapLegends.js'
import mapOfNigeria from '../map/map-of-nigeria.json'
import { DATA_KEYS } from '../constants'
import CasesDropdown from './CasesDropdown'

const CountryMap = ({ stats }) => {
  const [stateName, setStateName] = useState('')
  const [dataKey, setDataKey] = useState(DATA_KEYS.CONFIRMED_CASES)
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
              const {
                properties: { name },
              } = geo

              const stateName = name === 'Federal Capital Territory' ? 'fct' : slugifyStr(name)
              const numCases = stats[stateName]?.[dataKey] || 0
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
          <p>Confirmed: {formatNumber(stats[slug][DATA_KEYS.CONFIRMED_CASES])}</p>
          <p>Active: {formatNumber(stats[slug][DATA_KEYS.ACTIVE_CASES])}</p>
          <p>Discharged: {formatNumber(stats[slug][DATA_KEYS.DISCHARGED])}</p>
          <p>Deaths: {formatNumber(stats[slug][DATA_KEYS.DEATHS])}</p>
        </ReactTooltip>
      )}
    </section>
  )
}

export default memo(CountryMap)
