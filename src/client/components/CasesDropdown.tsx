import React from 'react'
import Dropdown from 'react-select'
import { DataKey } from '../../constants'

interface SelectOptions {
  value: DataKey
  label: string
}

const options: SelectOptions[] = [
  {
    value: DataKey.CONFIRMED_CASES,
    label: 'Confirmed cases',
  },
  {
    value: DataKey.ACTIVE_CASES,
    label: 'Active cases',
  },
  {
    value: DataKey.DISCHARGED,
    label: 'Discharged cases',
  },
  {
    value: DataKey.DEATHS,
    label: 'Deaths cases',
  },
]

interface CasesDropdownProps {
  onChange: ({ value }: { value: DataKey }) => void
}

const CasesDropdown = ({ onChange }: CasesDropdownProps) => {
  return (
    <Dropdown
      options={options}
      defaultValue={options[0]}
      onChange={onChange}
      isSearchable={false}
      classNamePrefix="react-select"
      className="react-select-container"
    />
  )
}

export default CasesDropdown
