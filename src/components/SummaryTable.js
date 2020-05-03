import React from 'react'
import { reverseSlug, allStates } from '../../server/utils'

const SummaryTable = ({ stats }) => {
  return (
    <section className="panel summary-table">
      <table>
        <thead>
          <tr>
            <th>States</th>
            <th>Confirmed Cases</th>
            <th>Active Cases</th>
            <th>Discharged</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>
          {allStates.map((state, index) => {
            const confirmedCases = stats[state]?.confirmedCases || 0
            const activeCases = stats[state]?.activeCases || 0
            const discharged = stats[state]?.discharged || 0
            const death = stats[state]?.death || 0
            return (
              <tr key={index}>
                <td>{reverseSlug(state)}</td>
                <td>{confirmedCases}</td>
                <td>{activeCases}</td>
                <td>{discharged}</td>
                <td>{death}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default SummaryTable
