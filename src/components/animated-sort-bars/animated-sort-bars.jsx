import React, { Component } from 'react'
import PropTypes from 'prop-types';

import '../../App.scss'
import './animated-sort-bars.module.css'

import * as d3 from 'd3';

export default class AnimatedSortBars extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }
    componentDidMount() { // Lifecycle: https://reactjs.org/docs/react-component.html#the-component-lifecycle
        console.log("initial...!");
        this.createBarChart()
    }
    componentDidUpdate() {
        console.log("updating!");
        this.createBarChart()
    }
    createBarChart() {
        const node = this.node
        const dataMax = d3.max(this.props.data)
        const yScale = d3.scaleLinear()
            .domain([0, dataMax])
            .range([0, this.props.svgSize.height])
            ;

        d3.select(node)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect')

        d3.select(node)
            .selectAll('rect')
            .data(this.props.data)
            .exit()
            .remove()

        d3.select(node)
            .selectAll('rect')
            .data(this.props.data)
            .style('fill', '#fe9922')
            .attr('x', (d, i) => i * 25)
            .attr('y', (d) => {
                return this.props.svgSize.height - yScale(d);
            })
            .attr('height', d => yScale(d))
            .attr('width', 25)
    }

    setupInitialScale() {

        let x = d3.scaleBand()
            .domain([])
            .range([0, this.config.svgAvailSpaceSize.width])
            .padding(0.1);
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
};