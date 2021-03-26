import React from 'react'
import { formatNumber } from '../../server/utils'
import SummaryCard from './SummaryCard'

const SummaryBlock = ({ total }) => {
  return (
    <section className="summary-wrapper">
      <SummaryCard title="Total number of confirmed cases" value={formatNumber(total.confirmedCases)} />
      <SummaryCard className="active-cases" title="Total number of active cases" value={formatNumber(total.activeCases)} />
      <SummaryCard className="recovered-cases" title="Total number of recovered patients" value={formatNumber(total.discharged)} />
      <SummaryCard className="death-cases" title="Total number of deaths recorded" value={formatNumber(total.death)} />
    </section>
  )
}

export default SummaryBlock
