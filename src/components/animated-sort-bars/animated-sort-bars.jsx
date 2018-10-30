import React, { Component } from 'react'
import PropTypes from 'prop-types';

import '../../App.scss'
import './animated-sort-bars.module.css'

import * as d3 from 'd3';
import "d3-selection-multi";

export default class AnimatedSortBars extends Component {
    dataMax;

    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }
    componentDidMount() { // Lifecycle: https://reactjs.org/docs/react-component.html#the-component-lifecycle
        this.createBarChart()
    }
    componentDidUpdate() {
        this.createBarChart()
    }
    createBarChart() {
        const node = this.node
        this.dataMax = d3.max(this.props.data.map((d)=>d.value));
        const { x: xScale, y: yScale } = this.setupInitialScale();

        // inject data
        let bars = d3.select(node)
            .selectAll('rect')
            .data(this.props.data, (d, i) => {
                // give each data an identifier so d3 can keep track of
                return d.id;
            })
            ;

        let t = d3.transition().duration(this.props.swapTransition); // cannot reuse across updates, have to regenerate t for tansition(); otherwise duration, ... won't work

        // new
        bars.enter().append('rect')
            .styles({
                opacity: 0,
                fill: "orange"
            })
            .attrs({
                rx: 5,
                ry: 5,
                x: (d) => xScale(d.id),
                y: this.props.svgSize.height,
                height: 0,
                width: () => xScale.bandwidth()
            })
            .transition(t)
            .styles({
                opacity: 1,
            })
            .attrs({
                y: (d, i) => {
                    return this.props.svgSize.height - yScale(d.value);
                },
                height: d => yScale(d.value),
            })

        // removed
        bars.exit()
            .attrs({
                class: "exit"
            })
            .transition(t)
            .attrs({
                height: 0
            })
            .styles({
                opacity: 0
            })
            .remove()

        // update existing
        bars
            .transition(t)
            .styles({
                fill: (d, i) => {
                    let found = this.props.highlightedBarIds.find((id) => d.id === id);
                    return (found === undefined) ? "orange" : "blue";
                }
            })
            .attr('x', (d, i) => xScale(d.id))
            // .attr('x', (d, i) => i * 25)
            .attr('y', (d) => {
                return this.props.svgSize.height - yScale(d.value);
            })
            .attr('height', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            ;


    }

    setupInitialScale = () => {
        let x = d3.scaleBand()
            .domain(this.props.data.map((d) => d.id))
            .range([0, this.props.svgSize.width])
            .padding(0.1);

        let y = d3.scaleLinear()
            .domain([0, this.dataMax])
            .range([0, this.props.svgSize.height])
            ;

        return {
            x,
            y
        }
    }

    render() {
        return (
            <svg className="AnimatedSortBarsSVG" ref={node => this.node = node}
                width={this.props.svgSize.width} height={this.props.svgSize.height}>
            </svg>
        );
    }
}

// See https://stackoverflow.com/questions/38363156/static-proptypes-not-working-under-es6
AnimatedSortBars.propTypes = {
    svgSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    data: PropTypes.array,
    swapTransition: PropTypes.number,
    highlightedBarIds: PropTypes.arrayOf(PropTypes.number)
};