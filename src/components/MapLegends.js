import React from 'react'
import { COLOR_BANDS } from '../../src/utils'

const legends = Object.values(COLOR_BANDS)

const MapLegends = () => (
  <section className="map-legends-wrapper">
    {legends.map((legend) => (
      <div className="map-legend" key={legend.color}>
        <div style={{ background: legend.color }} className="map-legend-color"></div>
        <p className="map-legend-text">{legend.text}</p>
      </div>
    ))}
  </section>
)

export default MapLegends
