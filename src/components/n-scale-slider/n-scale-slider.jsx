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
        onDatasetChange: PropTypes.func,
        scale: PropTypes.number,
        disabled: PropTypes.bool,
        datasetType: PropTypes.string
    }

    state = {
        value: `${this.props.scale}`,
        datasetType: this.props.datasetType
    };

    static scaleOptions = [
        "10", "30", "80", "200"
    ]

    static datasetOptions = [
        {
            uid: `random`,
            label: `Random`,
        },
        {
            uid: `sorted`,
            label: `Sorted`,
        },
        {
            uid: `sorted-reverse`,
            label: `Sorted Reverse`,
        },
    ]

    constructor(props) {
        super(props)
    }


    handleRadioChange = $event => {
        let radioStringValue = $event.target.value;
        this.setState({
            value: radioStringValue
        }, () => {
            this.props.onSlideChange(+radioStringValue)
        });
    }

    handleDatasetRadioChange = $event => {
        let radioStringValue = $event.target.value;
        this.setState({
            datasetType: radioStringValue
        }, () => {
            this.props.onDatasetChange(radioStringValue)
        });
    }


    render() {
        return (
            <div className={styles.scaleControlContainer}>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Scale (n)</FormLabel>
                    <RadioGroup
                        aria-label="scale-n"
                        name="scalen"
                        value={this.state.value}
                        onChange={this.handleRadioChange}
                    >
                        {
                            NScaleSlider.scaleOptions.map((option, i) => (
                                <FormControlLabel key={i} disabled={this.props.disabled} value={option} control={<Radio />} label={option} />
                            ))
                        }
                    </RadioGroup>
                    <FormHelperText>Change a different scale n to see how the sorting time changes.</FormHelperText>
                </FormControl>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">Dataset Type</FormLabel>
                    <RadioGroup
                        aria-label="dataset-type"
                        name="datasettype"
                        value={this.state.datasetType}
                        onChange={this.handleDatasetRadioChange}
                    >
                        {
                            NScaleSlider.datasetOptions.map((option) => (
                                <FormControlLabel key={option.uid} disabled={this.props.disabled} value={option.uid} control={<Radio />} label={option.label} />
                            ))
                        }
                    </RadioGroup>
                    <FormHelperText>Change a different data set to see how the performance changes for each sorting algorithm.</FormHelperText>
                </FormControl>
            </div>
        )
    }
}
