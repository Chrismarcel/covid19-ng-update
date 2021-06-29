import React, { useState } from 'react'

type SearchInputProps = {
  onChangeCb: (value: string) => void
  isError: boolean
}

const SearchInput = ({ onChangeCb, isError }: SearchInputProps) => {
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
