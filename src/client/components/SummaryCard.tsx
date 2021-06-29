import React from 'react'

type SummaryCardProps = {
  className?: string
  title: string
  value: string
}

const SummaryCard = ({ className = '', title, value }: SummaryCardProps) => (
  <div className={`panel summary-card ${className}`}>
    <h2 className="summary-card-value">{value}</h2>
    <h3 className="summary-card-title">{title}</h3>
  </div>
)

export default SummaryCard
