import React, { Component, } from 'react';

import * as RandomHelper from "./helpers/random";

import './App.scss';

import AnimatedSortBars from "./components/animated-sort-bars/animated-sort-bars";

import Button from '@material/react-button/dist';
import '@material/react-button/dist/button.css';

class App extends Component {
    swapTransition = 10
    n = 104;
    range = 240;
    data = this.generateRandomData();

    constructor(props) {
        super(props);
        this.state = {
            isSorting: false,
            bubbleSortData: this.data.slice(0),
            selectionSortData: this.data.slice(0),
            insertionSortData: this.data.slice(0),
            svgSize: {
                width: 500,
                height: 250,
            },
            bubbleSortHighlightedBarIds: [],
            selectionSortHighlightedBarIds: [],
            insertionSortHighlightedBarIds: []
        };
    }

    /**
     * UI Handlers
     * 
     * 
     */

    resetData = () => {
        this.data = this.generateRandomData()
        this.setState((prevState) => ({
            bubbleSortData: this.data.slice(0),
            selectionSortData: this.data.slice(0),
            insertionSortData: this.data.slice(0),
        }))
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
                // console.log("short cut!")
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

    generateRandomData() {
        return RandomHelper.generateRandomIntegers(this.n, this.range);
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
                                <AnimatedSortBars
                                    data={this.state.bubbleSortData}
                                    svgSize={this.state.svgSize}
                                    swapTransition={this.swapTransition}
                                    highlightedBarIds={this.state.bubbleSortHighlightedBarIds}
                                >
                                </AnimatedSortBars>
                            </div>
                            <div className="header">
                                <span>Bubble Sort</span>
                            </div>
                        </div>
                        <div className="sort-animation">
                            <div className="visualization">
                                <AnimatedSortBars
                                    data={this.state.selectionSortData}
                                    svgSize={this.state.svgSize}
                                    swapTransition={this.swapTransition}
                                    highlightedBarIds={this.state.selectionSortHighlightedBarIds}
                                >
                                </AnimatedSortBars>
                            </div>
                            <div className="header">
                                <span>Selection Sort</span>
                            </div>
                        </div>
                        <div className="sort-animation">
                            <div className="visualization">
                                <AnimatedSortBars
                                    data={this.state.insertionSortData}
                                    svgSize={this.state.svgSize}
                                    swapTransition={this.swapTransition}
                                    highlightedBarIds={this.state.insertionSortHighlightedBarIds}>
                                </AnimatedSortBars>
                            </div>
                            <div className="header">
                                <span>Insertion Sort</span>
                            </div>
                        </div>
                    </div>
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
                            onClick={() => console.log('clicked!')}>
                            Click Me!
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
