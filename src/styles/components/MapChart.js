import React, { useState, memo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import nigerianMap from '../../map/map-of-nigeria.json'
import { slugifyKey, generateChloropheth } from '../../../server/utils'
import ReactTooltip from 'react-tooltip'

const MapChart = ({ cases }) => {
  const [stateStats, setStateStats] = useState({})
  return (
    <section className="map-container panel">
      <ComposableMap
        data-tip=""
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ 
          rotate: [-10, -6],
          scale: 2000 
        }}
      >
        <Geographies geography={nigerianMap}>
          {({ geographies }) =>
            geographies.map((geo, index) => {
              const { properties: { name } } = geo
              const stateName = index === 18 ? 'abuja_fct' : slugifyKey(name)
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
