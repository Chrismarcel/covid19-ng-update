import React from 'react'
import ReactDOM from 'react-dom'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import nigerianMap from './map/map-of-nigeria.json'
import covid19cases from '../server/cases.json'
import { slugifyKey, generateChloropheth } from '../server/utils'

const App = () => (
  <main>
    <ComposableMap
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
            const numCases = covid19cases['states'][stateKey]
            console.log(generateChloropheth(numCases))
            return (
              <Geography 
                key={geo.rsmKey} 
                geography={geo}
                fill={generateChloropheth(numCases)}
                stroke="#008751"
                strokeWidth={0.7}
              />
            )
          })
        }
      </Geographies>
    </ComposableMap>
  </main>
)

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);
