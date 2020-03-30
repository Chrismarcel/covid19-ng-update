import React from 'react'
import SummaryCard from './SummaryCard'

const SummaryPanel = ({ summary }) => {
  return (
    <section className="summary-wrapper">
      <SummaryCard 
        title="Total number of confirmed cases" 
        value={summary.total_confirmed_cases} 
      />
      <SummaryCard 
        className="card-green" 
        title="Total number of recovered patients" 
        value={summary.discharged} 
      />
      <SummaryCard 
        className="card-warning" 
        title="Total number of deaths" 
        value={summary.death} 
      />
    </section>
  )
}

export default SummaryPanel
