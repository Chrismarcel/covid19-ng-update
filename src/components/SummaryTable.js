import React, { useState } from 'react'
import { reverseSlug, formatNumber } from '../../server/utils'
import SearchInput from './SearchInput'

const SummaryTable = ({ stats }) => {
  const [searchValue, setSearchValue] = useState('')

  const filteredStats = React.useMemo(() => {
    return Object.entries(stats)
      .filter(([state]) => state.includes(searchValue))
      .sort(([a], [b]) => a.localeCompare(b))
  }, [searchValue])

  return (
    <section className="panel summary-table">
      <div className="search-container">
        <SearchInput
          isError={!filteredStats.length}
          onChangeCb={(value) => {
            setSearchValue(value)
          }}
        />
      </div>
      {!filteredStats.length && (
        <p>
          <strong>No results found</strong>
        </p>
      )}
      {filteredStats.length > 0 && (
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
            {filteredStats.map(([state, data]) => {
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
      )}
    </section>
  )
}

export default SummaryTable
