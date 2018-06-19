import React from 'react'
import styled from 'styled-components'

import theme from './defaultTheme'

const ArrowUp = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' {...props}>
    <path d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' />
    <path d='M0 0h24v24H0z' fill='none' />
  </svg>
)

const StyledArrowUp = styled(ArrowUp)`
  cursor: pointer;
  fill: ${props => props.theme.primaryColor};
`

StyledArrowUp.defaultProps = { theme }

export default StyledArrowUp
