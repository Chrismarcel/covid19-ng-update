import React from 'react'
import { formatNumber } from '../../server/utils'
import { DATA_KEYS } from '../constants'
import SummaryCard from './SummaryCard'

const SummaryBlock = ({ total }) => {
  return (
    <section className="summary-wrapper">
      <SummaryCard
        title="Total number of confirmed cases"
        value={formatNumber(total[DATA_KEYS.CONFIRMED_CASES])}
      />
      <SummaryCard
        className="active-cases"
        title="Total number of active cases"
        value={formatNumber(total[DATA_KEYS.ACTIVE_CASES])}
      />
      <SummaryCard
        className="recovered-cases"
        title="Total number of recovered patients"
        value={formatNumber(total[DATA_KEYS.DISCHARGED])}
      />
      <SummaryCard
        className="death-cases"
        title="Total number of deaths recorded"
        value={formatNumber(total[DATA_KEYS.DEATHS])}
      />
    </section>
  )
}

export default SummaryBlock
