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
            return (
              <tr key={index}>
                <td>{reverseSlug(state)}</td>
                <td>{stats[state].confirmedCases}</td>
                <td>{stats[state].admitted}</td>
                <td>{stats[state].discharged}</td>
                <td>{stats[state].death}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default SummaryTable
