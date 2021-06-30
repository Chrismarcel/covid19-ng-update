import React from 'react'
import { formatNumber } from '../../utils'
import { DataKey } from '../../constants'
import SummaryCard from './SummaryCard'
import { StatsAggregate } from '~/server/scraper'

const SummaryBlock = ({ total }: { total: StatsAggregate }) => {
  return (
    <section className="summary-wrapper">
      <SummaryCard
        title="Total number of confirmed cases"
        value={formatNumber(total[DataKey.CONFIRMED_CASES])}
      />
      <SummaryCard
        className="active-cases"
        title="Total number of active cases"
        value={formatNumber(total[DataKey.ACTIVE_CASES])}
      />
      <SummaryCard
        className="recovered-cases"
        title="Total number of recovered patients"
        value={formatNumber(total[DataKey.DISCHARGED])}
      />
      <SummaryCard
        className="death-cases"
        title="Total number of deaths recorded"
        value={formatNumber(total[DataKey.DEATHS])}
      />
    </section>
  )
}

export default SummaryBlock
