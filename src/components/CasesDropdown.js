import React from 'react'
import Dropdown from 'react-select'
import { DATA_KEYS } from '../constants'

const options = [
  {
    value: DATA_KEYS.CONFIRMED_CASES,
    label: 'Confirmed cases',
  },
  {
    value: DATA_KEYS.ACTIVE_CASES,
    label: 'Active cases',
  },
  {
    value: DATA_KEYS.DISCHARGED,
    label: 'Discharged cases',
  },
  {
    value: DATA_KEYS.DEATHS,
    label: 'Deaths cases',
  },
]

const CasesDropdown = ({ onChange }) => {
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
