import React from 'react'

const SummaryCard = ({ className = '', title, value }) => (
  <div className={`panel summary-card ${className}`}>
    <h2 className="summary-card-title">{title}</h2>
    <h3 className="summary-card-value">{value}</h3>
  </div>
)

export default SummaryCard
