import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from "./n-scale-slider.module.scss"

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default class NScaleSlider extends Component {
    static propTypes = {
        // prop: PropTypes,
        onSlideChange: PropTypes.func,
        scale: PropTypes.number,
    }

    state = {
        value: `${this.props.scale}`,
    };

    constructor(props) {
        super(props)
    }


    handleRadioChange = $event => {
        let radioStringValue = $event.target.value;
        this.setState({
            value: radioStringValue
        },() => {
            this.props.onSlideChange(+radioStringValue) 
        });
    }




    render() {
        return (
            <div className={styles.scaleControlContainer}>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                        aria-label="Gender"
                        name="gender1"
                        value={this.state.value}
                        onChange={this.handleRadioChange}
                    >
                        <FormControlLabel value="10" control={<Radio />} label="10" />
                        <FormControlLabel value="40" control={<Radio />} label="40" />
                        <FormControlLabel value="200" control={<Radio />} label="200" />
                        <FormControlLabel
                            value="disabled"
                            disabled
                            control={<Radio />}
                            label="(Disabled option)"
                        />
                    </RadioGroup>
                    <FormHelperText>Change a different scale n to see how the sorting time changes.</FormHelperText>
                </FormControl>
            </div>
        )
    }
}
