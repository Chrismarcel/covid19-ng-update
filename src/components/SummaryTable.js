import React from 'react'
import { reverseSlug } from '../../server/utils'

const SummaryTable = ({ cases }) => {
  const states = Object.keys(cases)
  return (
    <section className="panel summary-table">
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Cases</th>
          </tr>
        </thead>
        <tbody>
          {states.map((state, index) => {
            return (
              <tr key={index}>
                <td>{reverseSlug(state)}</td>
                <td>{cases[state]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default SummaryTable
