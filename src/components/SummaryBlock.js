import React from 'react'
import SummaryCard from './SummaryCard'

const SummaryBlock = ({ total }) => {
  return (
    <section className="summary-wrapper">
      <SummaryCard 
        title="Total number of confirmed cases" 
        value={total.confirmedCases} 
      />
      <SummaryCard 
        title="Total number of admitted cases" 
        value={total.admitted} 
      />
      <SummaryCard 
        className="recovered-cases" 
        title="Total number of recovered patients" 
        value={total.discharged} 
      />
      <SummaryCard 
        className="death-cases" 
        title="Total number of deaths recorded" 
        value={total.death} 
      />
    </section>
  )
}

export default SummaryBlock
