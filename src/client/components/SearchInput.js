import React, { useState } from 'react'

const SearchInput = ({ onChangeCb, isError }) => {
  const [value, setValue] = useState('')

  const handleOnChange = ({ target }) => {
    setValue(target.value)
    if (onChangeCb) {
      onChangeCb(target.value)
    }
  }

  return (
    <div className="search-field-wrapper">
      <input
        type="text"
        value={value}
        onChange={handleOnChange}
        placeholder="Search states"
        className={`input ${isError ? 'error' : 'default'}`}
      />
    </div>
  )
}

export default SearchInput
