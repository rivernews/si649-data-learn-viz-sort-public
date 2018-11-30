import React, { Component } from 'react'
import PropTypes from 'prop-types'

import "./n-scale-slider.scss"

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
        "10", "30", "80"
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
            <div className="controlsContainer">
                <content className="content">
                    <div className="controlContainer">
                        <div className="section-title">
                            <h2>Part Two: In The Long Term</h2>
                        </div>
                        <div className="section-content">
                            <header>
                                <p className="long-description-text">
                                    You might already know the worst case of these three sort algorithms are all the same - O(n^2).
                                    However, as you may notice in your observation, their performance still slightly differs,
                                    and obviously there's one algorithm that's doing better than others.
                                    How about in the long term? Change a different size of scale (n) and find it out!
                                </p>
                            </header>
                            <div className="scaleControl">
                                <FormControl component="fieldset" >
                                    <FormLabel className="center-text light-bg-text" component="legend">Scale (n)</FormLabel>
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
                                    <FormHelperText>Change a different scale n to see how the difference of sorting time changes.</FormHelperText>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="controlContainer">
                        <div className="section-title">
                            <h2>Part Three: Different Data Types</h2>
                        </div>
                        <div className="section-content">
                            <header>
                                <p className="long-description-text">
                                    You might see one of the sorting algorithm outperforms another no matter how n scales.
                                    However, does that hold for any dataset? Let's try a different dataset and
                                    find it out!
                            </p>
                            </header>
                            <div className="datasetControl">
                                <FormControl component="fieldset" >
                                    <FormLabel className="center-text light-bg-text" component="legend">Dataset Type</FormLabel>
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
                                    <FormHelperText>Change a different data set to see how the performance varies for each sorting algorithm.</FormHelperText>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </content>
            </div>
        )
    }
}
