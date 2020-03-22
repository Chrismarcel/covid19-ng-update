import React from 'react'
import ReactDOM from 'react-dom'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import nigerianMap from './map/map-of-nigeria.json'

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
          geographies.map(geo => 
            <Geography 
              key={geo.rsmKey} 
              geography={geo}
              fill="#FFFFFF"
              stroke="#008751"
              strokeWidth={0.7}
            />)
        }
      </Geographies>
    </ComposableMap>
  </main>
)

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);
