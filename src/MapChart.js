import React, { useState, memo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import nigerianMap from './map/map-of-nigeria.json'
import covid19cases from '../server/cases.json'
import { slugifyKey, generateChloropheth } from '../server/utils'
import ReactTooltip from 'react-tooltip'

const MapChart = () => {
  const [stateStats, setStateStats] = useState({})

  return (
    <main>
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
              const stateKey = index === 18 ? 'abuja_fct' : slugifyKey(name)
              const numCases = covid19cases['states'][stateKey].toString()
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
      <ReactTooltip 
        place="bottom"
        backgroundColor="#023436"
      >
        {`${stateStats.name}: ${stateStats.numCases}`}
      </ReactTooltip>
    </main>
  )
}

export default memo(MapChart)
