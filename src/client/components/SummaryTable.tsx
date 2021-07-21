import React, { useState } from 'react'
import { reverseSlug, formatNumber } from '../../utils'
import SearchInput from './SearchInput'
import { ChevronDown, ChevronUp } from 'react-feather'
import { DataKey } from '../../constants'
import { StateStats } from '~/server/scraper'

interface TableHeadData {
  columnName: string
  dataKey: DataKey
}

const tableHeadData: TableHeadData[] = [
  { columnName: 'States', dataKey: DataKey.STATE },
  { columnName: 'Confirmed', dataKey: DataKey.CONFIRMED_CASES },
  { columnName: 'Active', dataKey: DataKey.ACTIVE_CASES },
  { columnName: 'Discharged', dataKey: DataKey.DISCHARGED },
  { columnName: 'Deaths', dataKey: DataKey.DEATHS },
]

interface ChevronIconProps {
  ascending: boolean
  className: string
  size: number
  strokeWidth: number
}

const ChevronIcon = ({ ascending, ...iconProps }: ChevronIconProps) => {
  return ascending ? <ChevronUp {...iconProps} /> : <ChevronDown {...iconProps} />
}

interface TableHeadRowProps {
  data: TableHeadData[]
  onSort: (data: { dataKey: DataKey; ascending: boolean }) => void
}

const TableHeadRow = ({ data, onSort }: TableHeadRowProps) => {
  const [activeColumn, setActiveColumn] = useState(DataKey.STATE)
  const [ascending, setAscending] = useState(true)

  const onTableHeadClick = (dataKey: DataKey, ascending: boolean) => {
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

const SummaryTable = ({ stats }: { stats: StateStats[] }) => {
  const [searchValue, setSearchValue] = useState('')
  const [sortKey, setSortKey] = useState(DataKey.STATE)
  const [isDescendingOrder, setIsDescendingOrder] = useState(false)

  const filteredStats = React.useMemo(() => {
    const sortedStats = stats
      .filter(({ state }) => state.includes(searchValue.toLowerCase()))
      .sort((stat1, stat2) => {
        if (sortKey !== DataKey.STATE) {
          return stat1[sortKey] - stat2[sortKey]
        }

        if (sortKey === DataKey.STATE) {
          return stat1.state.localeCompare(stat2.state)
        }

        return -1
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
              {filteredStats.map(({ state, ...cases }) => {
                const totalConfirmedCases = cases[DataKey.CONFIRMED_CASES]
                const totalActiveCases = cases[DataKey.ACTIVE_CASES]
                const totalDischarged = cases[DataKey.DISCHARGED]
                const totalDeaths = cases[DataKey.DEATHS]
                return (
                  <tr key={state}>
                    <td>{state !== 'fct' ? reverseSlug(state) : 'F.C.T'}</td>
                    <td>{formatNumber(totalConfirmedCases)}</td>
                    <td>{formatNumber(totalActiveCases)}</td>
                    <td>{formatNumber(totalDischarged)}</td>
                    <td>{formatNumber(totalDeaths)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default SummaryTable
