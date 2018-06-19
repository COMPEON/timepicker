import * as React from 'react'
import PropTypes from 'prop-types'

import TimepickerDialog, { TimepickerBlock } from './TimepickerDialog'
import { addOrSubtractMinutes, parseTime } from './utils'
import theme from './defaultTheme'

class Timepicker extends React.Component {
  static defaultProps = {
    color: '#27718c',
    minutesPerStep: 15,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    value: '00:00'
  }

  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    dialogClassName: PropTypes.string,
    from: PropTypes.string,
    innerRef: PropTypes.func,
    minutesPerStep: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    to: PropTypes.string,
    value: PropTypes.string.isRequired
  }

  state = {
    dialogOpen: false
  }

  componentDidMount () {
    this.addDOMEvents()
    this.ensureValueInRange()
  }

  componentWillUnmount () {
    this.removeDOMEvents()
  }

  addDOMEvents = () => {
    document.addEventListener('click', this.handleDocumentClick)
    document.addEventListener('keydown', this.handleDocumentKeyPress)
    if (this.inputElement) this.inputElement.addEventListener('keydown', this.handleDocumentKeyPress)
  }

  removeDOMEvents = () => {
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('keydown', this.handleDocumentKeyPress)
    if (this.inputElement) this.inputElement.removeEventListener('keydown', this.handleDocumentKeyPress)
  }

  ensureValueInRange = () => this.handleMinutesChange(0)

  closeDialog = () => {
    if (!this.state.dialogOpen) return

    const nextValue = this.ensureValueInRange()

    this.setState({ dialogOpen: false })
    this.props.onBlur(nextValue)
  }

  openDialog = () => {
    if (this.state.dialogOpen) return

    this.setState({ dialogOpen: true })
  }

  handleDocumentKeyPress = event => {
    if (event.key !== 'Tab') return

    this.closeDialog()
  }

  handleDocumentClick = event => {
    const element = event.target

    if (!this.dialogElement || !this.inputElement || !(element instanceof Node)) return
    if (this.dialogElement.contains(element) || this.inputElement.contains(element)) return

    this.closeDialog()
  }

  handleDialogRef = element => {
    this.dialogElement = element
  }

  handleInputRef = (element, ...args) => {
    this.inputElement = element

    if (this.props.innerRef) {
      this.props.innerRef.call(null, element, ...args)
    }
  }

  handleChange = event => this.props.onChange(event.target.value || '')

  handleFocus = event => {
    this.props.onFocus(event)
    this.openDialog()
  }

  handleHoursChange = delta => this.handleMinutesChange(60 * delta)

  handleMinutesChange = delta => {
    const { from, onChange, to, value } = this.props
    const nextValue = addOrSubtractMinutes(value, delta, { from, to })

    if (nextValue !== value) onChange(nextValue)

    return nextValue
  }

  handleWheel = event => {
    const { minutesPerStep } = this.props
    const delta = event.deltaY > 0 ? +minutesPerStep : -minutesPerStep

    event.preventDefault()

    this.handleMinutesChange(delta)
  }

  render () {
    const { dialogOpen } = this.state
    const {
      children,
      className,
      dialogClassName,
      inputClassName,
      minutesPerStep,
      value
    } = this.props
    const { hours, minutes } = parseTime(value)

    return (
      <div className={className}>
        {React.cloneElement(
          React.Children.only(children), {
            className: inputClassName,
            ref: this.handleInputRef,
            onBlur: () => {},
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            onTouchMove: this.handleWheel,
            onWheel: this.handleWheel,
            value
          })
        }
        {dialogOpen && (
          <TimepickerDialog
            className={dialogClassName}
            innerRef={this.handleDialogRef}
            onTouchMove={this.handleWheel}
            onWheel={this.handleWheel}
          >
            <TimepickerBlock
              number={hours}
              onDownClick={() => this.handleHoursChange(-1)}
              onUpClick={() => this.handleHoursChange(1)}
            />
            :
            <TimepickerBlock
              number={minutes}
              onDownClick={() => this.handleMinutesChange(-minutesPerStep)}
              onUpClick={() => this.handleMinutesChange(+minutesPerStep)}
            />
          </TimepickerDialog>
        )}
      </div>
    )
  }
}

export default Timepicker
