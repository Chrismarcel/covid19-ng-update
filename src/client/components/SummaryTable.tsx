import React, { useState } from 'react'
import { reverseSlug, formatNumber } from '../../utils'
import SearchInput from './SearchInput'
import { ChevronDown, ChevronUp } from 'react-feather'
import { DataKey } from '../../constants'
import { Stats } from './Dashboard'

type ColumnKey = DataKey | string

const StateKey: ColumnKey = 'states'

interface TableHeadData {
  columnName: string
  dataKey: ColumnKey
}

const tableHeadData: TableHeadData[] = [
  { columnName: 'States', dataKey: StateKey },
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
  onSort: (data: { dataKey: ColumnKey; ascending: boolean }) => void
}

const TableHeadRow = ({ data, onSort }: TableHeadRowProps) => {
  const [activeColumn, setActiveColumn] = useState(StateKey)
  const [ascending, setAscending] = useState(true)

  const onTableHeadClick = (dataKey: ColumnKey, ascending: boolean) => {
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

type SummaryTableProps = { [key: string]: Stats }

const SummaryTable = ({ stats }: SummaryTableProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [sortKey, setSortKey] = useState(StateKey)
  const [isDescendingOrder, setIsDescendingOrder] = useState(false)

  const filteredStats = React.useMemo(() => {
    const sortedStats = Object.entries(stats)
      .filter(([state]) => state.includes(searchValue.toLowerCase()))
      .sort(([state1, stats1], [state2, stats2]) => {
        if (sortKey === StateKey) {
          return state1.localeCompare(state2)
        }

        if (sortKey !== StateKey) {
          return stats1[sortKey] - stats2[sortKey]
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
              {filteredStats.map(([state, data]) => {
                const totalConfirmedCases = data?.[DataKey.CONFIRMED_CASES] || 0
                const totalActiveCases = data?.[DataKey.ACTIVE_CASES] || 0
                const totalDischarged = data?.[DataKey.DISCHARGED] || 0
                const totalDeaths = data?.[DataKey.DEATHS] || 0
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
