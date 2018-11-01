import React, { Component, } from 'react';

import * as DataGenerator from "./helpers/data-generator";

import './App.scss';

import AnimatedSortBars from "./components/animated-sort-bars/animated-sort-bars";
import NScaleSlider from "./components/n-scale-slider/n-scale-slider";

import Button from '@material/react-button/dist';
import '@material/react-button/dist/button.css';

function SortAnimation(props) {
    if (!Array.isArray(props.data) || props.data.length === 0)  {
        return <div></div> ;
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
    swapTransition = 10
    
    data = [];

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
            datasetType: "random",
            bubbleSortData: [],
            selectionSortData: [],
            insertionSortData: [],
            bubbleSortHighlightedBarIds: [],
            selectionSortHighlightedBarIds: [],
            insertionSortHighlightedBarIds: [],          
        };
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
            while (insertIndex >= 0 && dataRef[insertIndex].value > dataRef[sortingTargetIndex].value) {
                await this.markBarsByIndexes([i, insertIndex], "insertion")
                await this.asyncWait(this.swapTransition * 2);
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
            await this.asyncWait(this.swapTransition * 2);
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
                await this.asyncWait(this.swapTransition * 2);
                if (dataRef[j].value < dataRef[minIndex].value) {
                    minIndex = j;
                }
            }
            await this.markBarsByIndexes([i, minIndex], "selection");
            await this.swap(i, minIndex, "selection");
            await this.asyncWait(this.swapTransition * 2);
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
                await this.asyncWait(this.swapTransition * 2);
                if (dataRef[j].value > dataRef[j + 1].value) {
                    await this.swap(j, j + 1, "bubble");
                    isSwapped = true;
                    await this.asyncWait(this.swapTransition * 2);
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

    test() {
        console.log("hehe", DataGenerator.generateSortedReverseIntegers(20, 30))
    }

    /**
     * Template
     * 
     * 
     */

    

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h2>Basic Sort Algorithms Viz</h2>
                </header>
                <div className="App-content">
                    <div className="sort-animation-container">
                        <div className="sort-animation">
                            <div className="visualization">
                                <SortAnimation  
                                    data={this.state.bubbleSortData}
                                    svgSize={this.state.svgSize}
                                    swapTransition={this.swapTransition}
                                    highlightedBarIds={this.state.bubbleSortHighlightedBarIds}
                                />
                            </div>
                            <div className="header">
                                <span>Bubble Sort</span>
                            </div>
                        </div>
                        <div className="sort-animation">
                            <div className="visualization">
                                <SortAnimation
                                    data={this.state.selectionSortData}
                                    svgSize={this.state.svgSize}
                                    swapTransition={this.swapTransition}
                                    highlightedBarIds={this.state.selectionSortHighlightedBarIds}
                                />
                            </div>
                            <div className="header">
                                <span>Selection Sort</span>
                            </div>
                        </div>
                        <div className="sort-animation">
                            <div className="visualization">
                                <SortAnimation
                                    data={this.state.insertionSortData}
                                    svgSize={this.state.svgSize}
                                    swapTransition={this.swapTransition}
                                    highlightedBarIds={this.state.insertionSortHighlightedBarIds}
                                />
                            </div>
                            <div className="header">
                                <span>Insertion Sort</span>
                            </div>
                        </div>
                    </div>
                    <div className="user-controls">
                        <div className="action-container" >
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
                            <Button
                                className="action-button"
                                raised
                                onClick={this.test}>
                                Test
                            </Button>
                        </div>
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
            </div>
        );
    }
}

export default App;
