import React from 'react'
import { reverseSlug } from '../../server/utils'

const SummaryTable = ({ stats }) => {
  const states = Object.keys(stats).slice(0, -1)
  return (
    <section className="panel summary-table">
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Confirmed Cases</th>
            <th>Admitted</th>
            <th>Discharged</th>
            <th>Death</th>
          </tr>
        </thead>
        <tbody>
          {states.map((state, index) => {
            const { confirmedCases, admitted, discharged, death } = stats[state]
            return (
              <tr key={index}>
                <td>{reverseSlug(state)}</td>
                <td>{confirmedCases}</td>
                <td>{admitted}</td>
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
