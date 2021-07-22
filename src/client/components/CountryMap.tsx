import React, { useState, memo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import {
  slugifyStr,
  generateChloropheth,
  formatNumber,
  reverseSlug,
  toSentenceCase,
} from '../../utils'
import ReactTooltip from 'react-tooltip'
import MapLegends from './MapLegends'
import mapOfNigeria from '../map/map-of-nigeria.json'
import { DataKey, FCT } from '../../constants'
import CasesDropdown from './CasesDropdown'
import { StateStats } from '~/server/scraper'

const CountryMap = ({ stats }: { stats: StateStats[] }) => {
  const [stateIdx, setStateIdx] = useState(-1)
  const [dataKey, setDataKey] = useState(DataKey.CONFIRMED_CASES)
  const stat = stats[stateIdx]

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

              const stateName = name === FCT.FULL_NAME ? FCT.ABBR : slugifyStr(name)
              const idx = stats.findIndex((stat) => stat.state === stateName) || 0
              const numCases = stats[idx][dataKey] as number

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  role="region"
                  fill={generateChloropheth(numCases)}
                  stroke="#008751"
                  strokeWidth={0.7}
                  onMouseEnter={() => setStateIdx(idx)}
                  onMouseLeave={() => setStateIdx(-1)}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      <MapLegends />
      {stat && (
        <ReactTooltip place="bottom">
          <p>
            {stat.state === FCT.FULL_NAME ? FCT.FULL_NAME : toSentenceCase(reverseSlug(stat.state))}
          </p>
          <br />
          <p>Confirmed: {formatNumber(stat[DataKey.CONFIRMED_CASES])}</p>
          <p>Active: {formatNumber(stat[DataKey.ACTIVE_CASES])}</p>
          <p>Discharged: {formatNumber(stat[DataKey.DISCHARGED])}</p>
          <p>Deaths: {formatNumber(stat[DataKey.DEATHS])}</p>
        </ReactTooltip>
      )}
    </section>
  )
}

export default memo(CountryMap)
