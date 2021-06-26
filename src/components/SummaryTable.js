import React from 'react'
import { reverseSlug, formatNumber } from '../../server/utils'

const SummaryTable = ({ stats }) => {
  const statsByState = React.useMemo(() => {
    return Object.entries(stats).sort(([a], [b]) => a.localeCompare(b))
  }, [])

  return (
    <section className="panel summary-table">
      <table>
        <thead>
          <tr>
            <th>States</th>
            <th>Confirmed</th>
            <th>Active</th>
            <th>Discharged</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>
          {statsByState.map(([state, data]) => {
            const confirmedCases = data?.confirmedCases || 0
            const activeCases = data?.activeCases || 0
            const discharged = data?.discharged || 0
            const death = data?.death || 0
            if (state !== 'total') {
              return (
                <tr key={state}>
                  <td>{state !== 'fct' ? reverseSlug(state) : 'F.C.T'}</td>
                  <td>{formatNumber(confirmedCases)}</td>
                  <td>{formatNumber(activeCases)}</td>
                  <td>{formatNumber(discharged)}</td>
                  <td>{formatNumber(death)}</td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </section>
  )
}

export default SummaryTable
