import React, { useState, memo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import nigerianMap from '../../map/map-of-nigeria.json'
import { slugifyStr, generateChloropheth } from '../../../server/utils'
import ReactTooltip from 'react-tooltip'
import MapLegends from './MapLegends.js'

const MapChart = ({ cases }) => {
  const [stateStats, setStateStats] = useState({})
  return (
    <section className="map-container panel">
      <ComposableMap
        data-tip=""
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ 
          rotate: [-9.5, -9],
          scale: 3000 
        }}
      >
        <Geographies geography={nigerianMap}>
          {({ geographies }) =>
            geographies.map((geo, index) => {
              const { properties: { name } } = geo
              const stateName = index === 18 ? 'abuja_fct' : slugifyStr(name)
              const numCases = cases[stateName]
              return (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo}
                  fill={generateChloropheth(numCases)}
                  stroke="#008751"
                  strokeWidth={0.7}
                  onMouseEnter={() => setStateStats({ ...stateStats, name, numCases })}
                  onMouseLeave={() => setStateStats({})}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      <MapLegends />
      {stateStats.name && (
        <ReactTooltip 
          place="bottom"
        >
          {`${stateStats.name}: ${stateStats.numCases}`}
        </ReactTooltip>
      )}
    </section>
  )
}

export default memo(MapChart)
