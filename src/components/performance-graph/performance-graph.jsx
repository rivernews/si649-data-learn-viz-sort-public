import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3';
import "d3-selection-multi";

import "./performance-graph.scss";
import { AnimatedSortBars } from "../animated-sort-bars/animated-sort-bars";


export default class PerformanceGraph extends Component {
    static propTypes = {
        svgSize: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        }),
        data: PropTypes.array,
        transitionDuration: PropTypes.number,
    }

    state = {
        mockData: [
            {
                className: 'germany', // optional can be used for styling
                axes: [
                    { axis: "strength", value: 13, yOffset: 10 },
                    { axis: "intelligence", value: 6 },
                    { axis: "charisma", value: 5 },
                    { axis: "dexterity", value: 9 },
                    { axis: "luck", value: 2, xOffset: -20 }
                ]
            },
            {
                className: 'argentina',
                axes: [
                    { axis: "strength", value: 6 },
                    { axis: "intelligence", value: 7 },
                    { axis: "charisma", value: 10 },
                    { axis: "dexterity", value: 13 },
                    { axis: "luck", value: 9 }
                ]
            }
        ]
    }

    static properties = [
        "random", "sorted", "sorted-reverse"
    ]

    svg;
    radarConfig = {

    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.svg = d3.select(this.node);

        // RadarChart.draw(".performanceGraph", this.state.mockData);
    }

    componentDidUpdate() {

    }

    render() {
        return (
            // <svg className="PerformanceGraphSVG" ref={node => this.node = node}
            //     width={this.props.svgSize.width} height={this.props.svgSize.height}>
            // </svg>

            <div className="performanceGraph">

            </div>

        );
    }
}
