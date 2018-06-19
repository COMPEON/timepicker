import React from 'react'
import styled from 'styled-components'

import ArrowDown from './ArrowDown'
import ArrowUp from './ArrowUp'
import { formatNumber } from './utils'
import theme from './defaultTheme'

const TimepickerDialog = styled.div`
  align-items: center;
  background: white;
  border-radius: 5px;
  border: 1px solid ${props => props.theme.primaryColor};
  box-shadow: 0 1px 3px #d3d3d380, 0 1px 3px #d3d3d380;
  color: ${props => props.theme.primaryColor};
  display: flex;
  font-size: 22px;
  justify-content: center;
  position: absolute;
  user-select: none;
  width: 190px;
  z-index: 999;
`

TimepickerDialog.defaultProps = { theme }

const TimepickerPart = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: auto 12px;
`

export const TimepickerBlock = ({ number, onDownClick, onUpClick }: TTimepickerBlockProps) => (
  <TimepickerPart>
    <ArrowUp onClick={onUpClick} size={36} />
    {formatNumber(number)}
    <ArrowDown onClick={onDownClick} size={36} />
  </TimepickerPart>
)

export default TimepickerDialog
