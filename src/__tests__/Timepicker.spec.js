import React from 'react'
import { mount, shallow } from 'enzyme'

import Timepicker from '../Timepicker'
import TimepickerDialog from '../TimepickerDialog'
import ArrowDown from '../ArrowDown'
import ArrowUp from '../ArrowUp'

describe('<Timepicker />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <Timepicker>
        <input />
      </Timepicker>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('opens the dialog when focused', () => {
    const wrapper = shallow(
      <Timepicker>
        <input />
      </Timepicker>
    )

    wrapper.find('input').simulate('focus')

    expect(wrapper).toMatchSnapshot()
  })

  it('properly delegates different class names', () => {
    const wrapper = mount(
      <Timepicker
        className='className'
        dialogClassName='dialogClassName'
        inputClassName='inputClassName'
      >
        <input />
      </Timepicker>
    )

    wrapper.find('input').simulate('focus')

    expect(wrapper.find('div').at(0).props().className).toEqual('className')
    expect(wrapper.find(TimepickerDialog).props().className).toEqual('dialogClassName')
    expect(wrapper.find('input').props().className).toEqual('inputClassName')
  })

  it('changes the time on a mousewheel event', () => {
    const changeHandler = jest.fn()
    const wrapper = mount(
      <Timepicker onChange={changeHandler}>
        <input />
      </Timepicker>
    )

    wrapper.find('input').simulate('focus')
    wrapper.find(TimepickerDialog).simulate('wheel')

    expect(changeHandler).toHaveBeenCalled()
  })

  it('changes the time when arrows are clicked', () => {
    const changeHandler = jest.fn()
    const wrapper = mount(
      <Timepicker
        onChange={changeHandler}
        minutesPerStep={15}
        value='20:00'
      >
        <input />
      </Timepicker>
    )

    wrapper.find('input').simulate('focus')

    const downArrows = wrapper.find(ArrowDown)
    const upArrows = wrapper.find(ArrowUp)

    expect(downArrows.length).toBe(2)
    expect(upArrows.length).toBe(2)

    downArrows.at(0).simulate('click')
    downArrows.at(1).simulate('click')

    expect(changeHandler).toHaveBeenCalledTimes(2)
    expect(changeHandler).toHaveBeenCalledWith('19:00')
    expect(changeHandler).toHaveBeenCalledWith('19:45')

    upArrows.at(0).simulate('click')
    upArrows.at(1).simulate('click')

    expect(changeHandler).toHaveBeenCalledTimes(4)
    expect(changeHandler).toHaveBeenCalledWith('21:00')
    expect(changeHandler).toHaveBeenCalledWith('20:15')
  })
})
