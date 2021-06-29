import React, { useState } from 'react'
import { Input } from 'antd'
import { isMobile } from 'react-device-detect'
import { validateNumber, countDots } from 'src/common/function'
import './style.scss'

const PriceInput = ({ value = '', suffix = '', onChange, isError = false, errorMessage = '', onlyInteger = false, placeholder = '0.000', maxDecimals = 16 }) => {
  const [number, setNumber] = useState('')

  const triggerChange = changedValue => {
    if (onChange) {
      onChange({
        number,
        ...value,
        ...changedValue
      })
    }
  }

  const onNumberChange = e => {
    const newNumber = e.target.value.toString()

    if (!validateNumber(newNumber)) {
      if (newNumber.length === 0) {
        setNumber('')
        triggerChange({
          number: ''
        })
      }
    } else {
      let dotsCount = countDots(newNumber, '\\.')
      if (onlyInteger ? dotsCount <= 0 : dotsCount <= 1) {
        let isError = false
        let decimalCount = newNumber.length - newNumber.indexOf('.') - 1
        let integerCount = String(parseInt(newNumber)).length
        if (newNumber === '00') {
          isError = true
        }
        if (newNumber[0] === '0' && newNumber[1] && newNumber[1] !== '0' && newNumber[1] !== '.') {
          isError = true
          setNumber(newNumber[1])
          triggerChange({
            number: newNumber[1]
          })
        }
        if (integerCount > 10) {
          isError = true
        }
        if (dotsCount === 1 && decimalCount > maxDecimals) {
          isError = true
        }
        if (!isError) {
          setNumber(newNumber)
          triggerChange({
            number: newNumber
          })
        }
      }
    }
  }

  return (
    <div className='price-input-wrapper'>
      <Input
        type={isMobile ? 'number' : 'text'}
        placeholder={placeholder}
        step='any'
        inputMode='decimal'
        suffix={suffix}
        value={value.number || number}
        onChange={onNumberChange}
      />
      {isError && <span className='price-input-error'>{errorMessage}</span>}
    </div>
  )
}

export default PriceInput
