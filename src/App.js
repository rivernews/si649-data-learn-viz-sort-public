import React, { Component, } from 'react';

import * as DataGenerator from "./helpers/data-generator";

import './App.scss';

import AnimatedSortBars from "./components/animated-sort-bars/animated-sort-bars";
import NScaleSlider from "./components/n-scale-slider/n-scale-slider";
import PerformanceGraph from "./components/performance-graph/performance-graph";

import Button from '@material/react-button/dist';
import '@material/react-button/dist/button.css';
import * as d3Scales from 'd3-scale';
import { Slider } from "@rmwc/slider";
import '@material/slider/dist/mdc.slider.css';

function SortAnimation(props) {
    if (!Array.isArray(props.data) || props.data.length === 0) {
        return <div></div>;
    }

    return <AnimatedSortBars
        data={props.data}
        svgSize={props.svgSize}
        swapTransition={props.swapTransition}
        highlightedBarIds={props.highlightedBarIds}
    >
    </AnimatedSortBars>
}

class App extends Component {
    transitionDurationRange = [10, 1000];

    constructor(props) {
        super(props);

        this.state = {
            isSorting: false,
            scale: 10,
            range: 240,
            svgSize: {
                width: 500,
                height: 250,
            },
            // performanceSvgSize: {
            //     width: 500,
            //     height: 500,
            // },
            transitionDuration: 10,
            transitionDurationSliderValue: 10,
            datasetType: "random",
            bubbleSortData: [],
            selectionSortData: [],
            insertionSortData: [],
            bubbleSortHighlightedBarIds: [],
            selectionSortHighlightedBarIds: [],
            insertionSortHighlightedBarIds: [],
        };

        this.transitionDurationSliderScale = d3Scales.scalePow()
            .exponent(4)
            .domain([0, 100])
            .range(this.transitionDurationRange);
    }

    componentDidMount() {
        this.setState(this.generateNewDataForAllSort(this.state.range))
    }
    componentDidUpdate() {
    }

    /**
     * UI Handlers
     * 
     * 
     */

    resetData = () => {
        this.setState(this.generateNewDataForAllSort(this.state.range))
    }

    onStartSortClick = () => {
        this.asyncSetState({
            callback: function (state) {
                state.isSorting = true
                return state;
            }
        })
            .then(() =>
                Promise.all([
                    this.bubbleSort(this.state.bubbleSortData),
                    this.selectionSort(this.state.selectionSortData),
                    this.insertionSort(this.state.insertionSortData),
                ])
            )
            .then(() =>
                this.asyncSetState({
                    callback: function (state) {
                        state.isSorting = false
                        return state;
                    }
                })
            )
            ;
    }

    onNScaleSlideChange = $event => {
        let scale = $event;
        this.setState({
            scale,
        }, () => {
            this.updateDataset(
                this.generateNewDataForAllSort(this.state.range)
            )
        });
        ;
    }

    onDatasetTypeChange = $event => {
        let datasetType = $event;
        this.setState({
            datasetType,
        }, () => {
            this.updateDataset(
                this.generateNewDataForAllSort(this.state.range)
            );
        });
    }

    updateDataset(newDataSets) {
        this.setState({
            bubbleSortData: newDataSets.bubbleSortData,
            selectionSortData: newDataSets.selectionSortData,
            insertionSortData: newDataSets.insertionSortData
        });
    }

    onTransitionDurationSliderValueChange = ($event) => {
        let transitionDurationSliderValue = this.transitionDurationSliderScale($event.detail.value);
        this.setState({
            transitionDurationSliderValue,
            transitionDuration: transitionDurationSliderValue
        });
    }

    /**
     * Core Sort ALgorithms
     * 
     * 
     */

    async insertionSort(dataRef = []) {
        let n = dataRef.length;
        let stateKeyName = this.getStateDataKeyName("insertion")

        for (let i = 1; i < n; i++) {
            let sortingTargetIndex = i;
            let insertIndex = i - 1;

            await this.markBarsByIndexes([sortingTargetIndex, insertIndex], "insertion")
            while (insertIndex >= 0 && dataRef[insertIndex].value > dataRef[sortingTargetIndex].value) {
                await this.markBarsByIndexes([sortingTargetIndex, insertIndex], "insertion")
                await this.asyncWait(this.state.transitionDuration * 2);
                insertIndex--;
            }
            insertIndex++;

            await this.asyncSetState({
                callback: function (state) {
                    let sortingTarget = state[stateKeyName][sortingTargetIndex];
                    state[stateKeyName].splice(sortingTargetIndex, 1);
                    state[stateKeyName].splice(insertIndex, 0, sortingTarget);
                    return state
                }
            })
            await this.markBarsByIndexes(DataGenerator.generateRangeInt(insertIndex, sortingTargetIndex, true), "insertion")
            await this.asyncWait(this.state.transitionDuration * 2);
        }

        await this.clearMarkedBars("insertion");
        return;
    }

    async selectionSort(dataRef = []) {
        let n = dataRef.length;
        if (dataRef.length === 0) return;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                await this.markBarsByIndexes([j, minIndex], "selection")
                await this.asyncWait(this.state.transitionDuration * 2);
                if (dataRef[j].value < dataRef[minIndex].value) {
                    minIndex = j;
                }
            }
            await this.markBarsByIndexes([i, minIndex], "selection");
            await this.swap(i, minIndex, "selection");
            await this.asyncWait(this.state.transitionDuration * 2);
        }

        await this.clearMarkedBars("selection");
        return;
    }

    async bubbleSort(dataRef = []) {
        let n = dataRef.length;
        if (dataRef.length === 0) return;

        for (let i = 0; i < n; i++) {
            let isSwapped = false;
            for (let j = 0; j < n - 1 - i; j++) {
                await this.markBarsByIndexes([j, j + 1], "bubble")
                await this.asyncWait(this.state.transitionDuration * 2);
                if (dataRef[j].value > dataRef[j + 1].value) {
                    await this.swap(j, j + 1, "bubble");
                    isSwapped = true;
                    await this.asyncWait(this.state.transitionDuration * 2);
                }
            }
            if (!isSwapped) {
                break;
            }
        }
        await this.clearMarkedBars("bubble");
        return;
    }

    /**
     * Helper Functions
     * 
     * 
     */

    async markBarsByIndexes(indexes, sortType) {
        let dataKeyName = this.getStateDataKeyName(sortType);
        let highlightedBarIdsKeyName = this.getHighlightedBarIdsKeyName(sortType);

        await this.asyncSetState({
            callback: function (state) {
                let highlightedBarIds = []
                for (let index of indexes) {
                    highlightedBarIds.push(state[dataKeyName][index].id);
                }
                if (sortType) {
                    state[highlightedBarIdsKeyName] = highlightedBarIds;
                }
                return state;
            }
        })
    }

    getStateDataKeyName(sortType = "") {
        return (sortType !== "") ? `${sortType.toLowerCase()}SortData` : null;
    }

    getHighlightedBarIdsKeyName(sortType = "") {
        return (sortType !== "") ? `${sortType}SortHighlightedBarIds` : null;
    }

    async clearMarkedBars(sortType) {
        return new Promise((resolve, reject) => {
            this.setState((state) => {
                resolve()
                return {
                    [this.getHighlightedBarIdsKeyName(sortType)]: []
                }
            });
        });
    }

    async swap(index1, index2, sortType) {
        let dataKeyName = this.getStateDataKeyName(sortType);
        await this.asyncSetState({
            callback: function (state) {
                let temp = Object.assign(state[dataKeyName][index1])
                state[dataKeyName][index1] = state[dataKeyName][index2]
                state[dataKeyName][index2] = temp
                return state;
            }
        });
        return;
    }

    asyncSetState({ callback = null } = {}) {
        return new Promise(resolve => {
            this.setState((state) => {
                if (callback !== null) {
                    let callbackAssignedState = callback(state);
                    resolve();
                    return Object.assign(state, callbackAssignedState);
                }
            })
        });
    }

    asyncWait(milliSecond) {
        return new Promise(resolve => setTimeout(resolve, milliSecond));
    }

    generateNewDataForAllSort(range) {
        let n = this.state.scale;
        let data = []
        if (this.state.datasetType === "random") {
            data = DataGenerator.generateRandomIntegers(n, range);
        }
        else if (this.state.datasetType === "sorted") {
            data = DataGenerator.generateSortedIntegers(n, range);
        }
        else if (this.state.datasetType === "sorted-reverse") {
            data = DataGenerator.generateSortedReverseIntegers(n, range);
        }

        return {
            bubbleSortData: data.slice(0),
            selectionSortData: data.slice(0),
            insertionSortData: data.slice(0),
        }
    }

    /**
     * Template
     * 
     * 
     */



    render() {
        return (
            <div className="App">
                <div className="mainPage">
                    <header className="App-header pageStandardContent">
                        <h2 className="headline-text" >Basic Sort Algorithms Viz</h2>
                        <h2>Part One: A Quick Look</h2>
                        <p className="long-description-text">
                            Do you know how differnt sorting algorithms "look like" under the hood?
                            Do you know why Bubble Sort is called bubble sort?

                            Press the "start" button to trigger the sort and observe the changes in real-time. 
                    </p>
                    <p className="long-description-text">
                        Comparison operation is the dominant factor of sort performance. 
                        Pink-marked bars indicate where a comparison or a costy operation occurred between two numbers.
                        
                        Particularly, observe how the bars move,
                        and how each sort algorithm progress toward their final results.
                    </p>
                    <div className="action-container" >
                        <div className="start-actions">
                            <Button
                                className="action-button"
                                raised
                                disabled={this.state.isSorting}
                                onClick={this.onStartSortClick}>
                                Start
                            </Button>
                            <Button
                                className="action-button"
                                raised
                                disabled={this.state.isSorting}
                                onClick={this.resetData}>
                                Reset
                            </Button>
                        </div>
                        <div className="transition-speed-actions">
                            <p>
                                Animation Speed (10-1000ms):&nbsp;
                                <strong>
                                    {this.state.transitionDuration.toFixed(2)} ms / per comparison
                                </strong>
                            </p>
                            <Slider
                                theme="primary primaryBg"
                                onChange={this.onTransitionDurationSliderValueChange }
                            />
                        </div>
                    </div>
                    </header>
                    <div className="App-content">
                        <div className="sort-animation-container">
                            <header>
                            </header>
                            <div className="sort-animation">
                                <div className="visualization">
                                    <SortAnimation
                                        data={this.state.bubbleSortData}
                                        svgSize={this.state.svgSize}
                                        swapTransition={this.state.transitionDuration}
                                        highlightedBarIds={this.state.bubbleSortHighlightedBarIds}
                                    />
                                </div>
                                <div className="header center-text">
                                    <span>Bubble Sort</span>
                                </div>
                            </div>
                            <div className="sort-animation">
                                <div className="visualization">
                                    <SortAnimation
                                        data={this.state.selectionSortData}
                                        svgSize={this.state.svgSize}
                                        swapTransition={this.state.transitionDuration}
                                        highlightedBarIds={this.state.selectionSortHighlightedBarIds}
                                    />
                                </div>
                                <div className="header center-text">
                                    <span>Selection Sort</span>
                                </div>
                            </div>
                            <div className="sort-animation">
                                <div className="visualization">
                                    <SortAnimation
                                        data={this.state.insertionSortData}
                                        svgSize={this.state.svgSize}
                                        swapTransition={this.state.transitionDuration}
                                        highlightedBarIds={this.state.insertionSortHighlightedBarIds}
                                    />
                                </div>
                                <div className="header center-text">
                                    <span>Insertion Sort</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="secondaryPage">
                    <div className="user-controls pageStandardContent">
                        
                        <div className="scale-control">
                            <NScaleSlider
                                onSlideChange={this.onNScaleSlideChange}
                                onDatasetChange={this.onDatasetTypeChange}
                                scale={this.state.scale}
                                datasetType={this.state.datasetType}
                                disabled={this.state.isSorting}>
                            </NScaleSlider>
                        </div>
                    </div>
                </div>
                {/* <div className="thridPage pageStandardContent">
                    <h2>Part Three: Performance </h2>
                    <div className="performance-graph-container" >
                        {
                            this.state.svgSize &&
                            (<PerformanceGraph
                                data={[]}
                                svgSize={this.state.performanceSvgSize}
                                transitionDuration={this.props.swapTransition}
                                highlightedBarIds={this.props.highlightedBarIds}
                            />)
                        }

                    </div>
                </div> */}
            </div>
        );
    }
}

export default App;
