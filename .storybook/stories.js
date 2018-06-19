import React from 'react'
import { ThemeProvider } from 'styled-components'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Timepicker from '../src'

class TimepickerExample extends React.Component {
  state = {
    value: '00:00'
  }

  handleChange = value => {
    this.setState({ value })
  }

  render () {
    return (
      <Timepicker
        {...this.props}
        {...this.state}
        onBlur={action('blur')}
        onChange={this.handleChange}
        onFocus={action('focus')}
      >
        <input />
      </Timepicker>
    )
  }
}

storiesOf('Timepicker', module)
  .add('default', () => (
    <TimepickerExample />
  ))
  .add('with low minutes per step', () => (
    <TimepickerExample minutesPerStep={1} />
  ))
  .add('with a ThemeProvider', () => (
    <ThemeProvider theme={{ primaryColor: '#cc0000' }}>
      <TimepickerExample />
    </ThemeProvider>
  ))
  .add('with a range', () => (
    <TimepickerExample from='10:00' to='21:00' />
  ))
  .add('with an inverted range', () => (
    <TimepickerExample from='21:00' to='10:00' />
  ))
