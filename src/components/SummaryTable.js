import React, { useState } from 'react'
import { reverseSlug, formatNumber } from '../../src/utils'
import SearchInput from './SearchInput'
import { ChevronDown, ChevronUp } from 'react-feather'
import { DATA_KEYS } from '../constants'

const tableHeadData = [
  { columnName: 'States', dataKey: DATA_KEYS.STATES },
  { columnName: 'Confirmed', dataKey: DATA_KEYS.CONFIRMED_CASES },
  { columnName: 'Active', dataKey: DATA_KEYS.ACTIVE_CASES },
  { columnName: 'Discharged', dataKey: DATA_KEYS.DISCHARGED },
  { columnName: 'Deaths', dataKey: DATA_KEYS.DEATHS },
]

const ChevronIcon = ({ ascending, ...iconProps }) => {
  return ascending ? <ChevronUp {...iconProps} /> : <ChevronDown {...iconProps} />
}

const TableHeadRow = ({ data, onSort }) => {
  const [activeColumn, setActiveColumn] = useState(data[0].dataKey)
  const [ascending, setAscending] = useState(true)

  const onTableHeadClick = (dataKey, ascending) => {
    setActiveColumn(dataKey)
    setAscending(dataKey !== activeColumn ? ascending : !ascending)
    if (onSort) {
      onSort({ dataKey, ascending })
    }
  }

  return (
    <thead>
      <tr>
        {data.map(({ columnName, dataKey }) => (
          <th key={dataKey} onClick={() => onTableHeadClick(dataKey, ascending)}>
            <p className="row-data">
              {columnName}
              {dataKey === activeColumn && (
                <ChevronIcon
                  className="active-table-head"
                  ascending={ascending}
                  size={20}
                  strokeWidth={2}
                />
              )}
            </p>
          </th>
        ))}
      </tr>
    </thead>
  )
}

const SummaryTable = ({ stats }) => {
  const [searchValue, setSearchValue] = useState('')
  const [sortKey, setSortKey] = useState(DATA_KEYS.STATES)
  const [isDescendingOrder, setIsDescendingOrder] = useState(false)

  const filteredStats = React.useMemo(() => {
    const sortedStats = Object.entries(stats)
      .filter(([state]) => state.includes(searchValue.toLowerCase()))
      .sort(([state1, stats1], [state2, stats2]) => {
        if (sortKey == DATA_KEYS.STATES) {
          return state1.localeCompare(state2)
        }
        return stats1[sortKey] - stats2[sortKey]
      })

    if (isDescendingOrder) {
      return sortedStats.reverse()
    }

    return sortedStats
  }, [searchValue, sortKey, isDescendingOrder])

  return (
    <section className="panel summary-table">
      <div className="search-container">
        <SearchInput
          isError={!filteredStats.length}
          onChangeCb={(searchTerm) => {
            setSearchValue(searchTerm)
          }}
        />
      </div>
      {!filteredStats.length && <p className="no-results">No results found</p>}
      {filteredStats.length > 0 && (
        <div className="scrollable-container">
          <table>
            <TableHeadRow
              data={tableHeadData}
              onSort={({ dataKey, ascending }) => {
                setSortKey(dataKey)
                setIsDescendingOrder(ascending)
              }}
            />
            <tbody>
              {filteredStats.map(([state, data]) => {
                const totalConfirmedCases = data?.[DATA_KEYS.CONFIRMED_CASES] || 0
                const totalActiveCases = data?.[DATA_KEYS.ACTIVE_CASES] || 0
                const totalDischarged = data?.[DATA_KEYS.DISCHARGED] || 0
                const totalDeaths = data?.[DATA_KEYS.DEATHS] || 0
                if (state !== 'total') {
                  return (
                    <tr key={state}>
                      <td>{state !== 'fct' ? reverseSlug(state) : 'F.C.T'}</td>
                      <td>{formatNumber(totalConfirmedCases)}</td>
                      <td>{formatNumber(totalActiveCases)}</td>
                      <td>{formatNumber(totalDischarged)}</td>
                      <td>{formatNumber(totalDeaths)}</td>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default SummaryTable
