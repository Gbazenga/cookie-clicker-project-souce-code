import { configureStore, createSlice } from "@reduxjs/toolkit";

const DUMMY_DATA = [
    {
        key: 1,
        name: "Building 1",
        cps: 1,
        cost: 20,
        totalCps: 0
    },
    {
        key: 2,
        name: "Building 2",
        cps: 5,
        cost: 100,
        totalCps: 0
    },
    {
        key: 3,
        name: "Building 3",
        cps: 25,
        cost: 500,
        totalCps: 0
    }
]

const UPGRADE_DATA = [
    {
        key: "upg1",
        name: "Building 1 Upgrade",
        target: "Building 1",
        timesBought: 0,
        cost: 100
    },
    {
        key: "upg2",
        name: "Building 2 Upgrade",
        target: "Building 2",
        timesBought: 0,
        cost: 500
    },
    {
        key: "upg3",
        name: "Building 3 Upgrade",
        target: "Building 3",
        timesBought: 0,
        cost: 2500
    },
]

const counterSlice = createSlice({
    name: "counter",
    initialState: {counter: 0, cps: 0, buildings: DUMMY_DATA, upgrades: UPGRADE_DATA},
    reducers: {
        increment(state, action) {
            state.counter += action.payload;
        },
        addPerSec(state, action) {
            state.cps = state.cps + action.payload;
        },

        //Handles upgrade purchases and updating building cps and total cps
        upgradeCalc(state, action) {
            for(const building in state.buildings){
                if(state.buildings[building].name === action.payload){
                    state.cps += state.buildings[building].totalCps;
                    state.buildings[building].cps *= 2;
                    state.buildings[building].totalCps *= 2;
                }
            }

            for(const upgrade in state.upgrades){
                if(state.upgrades[upgrade].target === action.payload){
                    state.upgrades[upgrade].cost = Math.floor(state.upgrades[upgrade].cost * 2.5)
                    state.upgrades[upgrade].timesBought += 1
                }
            }
        },

        // Handles building purchases and cost rises after every buy
        buildingCalc(state, action) {
            for(const building in state.buildings){
                if(state.buildings[building].name === action.payload){
                    state.buildings[building].totalCps += state.buildings[building].cps ;
                    state.buildings[building].cost = Math.floor(state.buildings[building].cost * 1.25)
                }
            }
        }
    }
})

const store = configureStore({
    reducer: counterSlice.reducer
})

export const counterActions = counterSlice.actions;
export default store;