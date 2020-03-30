import React from 'react'
import { COLOR_BANDS } from '../../../server/utils'

const MapLegends = () => (
  <section className="map-legends-wrapper">
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.DEFAULT }} className="map-legend-color"></div>
      <p className="map-legend-text">No cases</p>
    </div>
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.LESS_THAN_11 }} className="map-legend-color"></div>
      <p className="map-legend-text">1 - 10</p>
    </div>
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.LESS_THAN_51 }} className="map-legend-color"></div>
      <p className="map-legend-text">11 - 50</p>
    </div>
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.LESS_THAN_101 }} className="map-legend-color"></div>
      <p className="map-legend-text">51 - 100</p>
    </div>
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.LESS_THAN_501 }} className="map-legend-color"></div>
      <p className="map-legend-text">101 - 500</p>
    </div>
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.LESS_THAN_1001 }} className="map-legend-color"></div>
      <p className="map-legend-text">501 - 1000</p>
    </div>
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.LESS_THAN_5001 }} className="map-legend-color"></div>
      <p className="map-legend-text">1001 - 5000</p>
    </div>
    <div className="map-legend">
      <div style={{ background: COLOR_BANDS.GREATER_THAN_5000 }} className="map-legend-color"></div>
      <p className="map-legend-text">> 5000</p>
    </div>
  </section>
)

export default MapLegends
