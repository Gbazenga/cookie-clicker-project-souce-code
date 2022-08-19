import "./BuildingList.css"

import { counterActions } from "../store/store"
import { useDispatch, useSelector } from "react-redux"

import { useEffect } from "react"

function BuildingList() {

    const dispatch = useDispatch()
    const buildings = useSelector((state) => state.buildings)
    const counter = useSelector((state) => state.counter)

    function addBuildingHandler(event) {
        event.preventDefault();
        const target = event.target.parentElement;
        const cost = Number(target.children[3].children[0].textContent)
        const value = Number(target.children[1].children[0].textContent)
        const name = target.children[0].textContent;

        dispatch(counterActions.addPerSec(value))
        dispatch(counterActions.increment(-cost)) 
        dispatch(counterActions.buildingCalc(name)) 
    }

    useEffect(() => {
        //disables button if you dont have enough for the upgrade
        const items = document.getElementsByClassName("buildingItem")
        for(const item of items){
            const buttons = item.getElementsByClassName("btn")
            if(item.children[3].children[0].textContent > counter){  
                buttons[0].disabled = true
                buttons[2].disabled = true
            }
            else{
                buttons[0].disabled = false
                buttons[2].disabled = false
            }
        }
        
        for(const item of items){
            const buttons = item.getElementsByClassName("btn")
            const cost = Number(item.children[3].children[0].textContent)
            const buyableAmount = priceAllHandler(cost)
            if(buyableAmount < 10){  
                buttons[1].disabled = true
            }
            else{
                buttons[1].disabled = false
            }
        }
    }, [counter])

    function changeToLettering(a) {
        let lettering = [" M", " B", " T", " QA", " QI", " SX", " SP", " O", " N", " D", " UD", " DD", " TD", " QD"]
        let zeros = 0;
        let multiplier = 0;
        let backup = a;
            for(zeros; a >= 10; zeros++){
                a /= 10
            }

        multiplier = 10 ** (Math.floor(zeros / 3) * 3)

        return ((Math.round(backup) / multiplier).toFixed(1) + lettering[Math.floor(zeros / 3) - 2])
    }

    function priceAllHandler(cost){
        //calculates the amount of buildings you can buy at once

        let total = 0;
        let prevValue = 0;
        let count = 0;
    
        if( cost > counter){
            return 0
        }else{
            total = cost
            prevValue = cost
            for(count; total < counter; count++){
                prevValue = Math.floor(prevValue*1.25)
                total += prevValue;
            }

        return count
        }

    }

    function buyAllHandler(event) {
        //buys multiple buildings at once
        const target = event.target.parentElement;
        const cost = Number(target.children[3].children[0].textContent)
        const value = Number(target.children[1].children[0].textContent)
        const name = target.children[0].textContent;

        let total = 0;
        let prevValue = cost;
        let counterSnap = counter
        let count = 0;

        
        for(count; prevValue < counterSnap; count++){
            total += prevValue;
            counterSnap -= prevValue;
            prevValue = Math.floor(prevValue*1.25)
  
            dispatch(counterActions.buildingCalc(name))
        }

        dispatch(counterActions.addPerSec(value*count))
        dispatch(counterActions.increment(-total)) 
        
    }

    function buyTenHandler(event) {
        //buys 10 buildings at once
        const target = event.target.parentElement;
        const cost = Number(target.children[3].children[0].textContent)
        const value = Number(target.children[1].children[0].textContent)
        const name = target.children[0].textContent;

        let total = 0;
        let prevValue = cost;
        let count = 0;

        
        for(count; count < 10; count++){
            total += prevValue;
            prevValue = Math.floor(prevValue*1.25)
  
            dispatch(counterActions.buildingCalc(name))
        }

        dispatch(counterActions.addPerSec(value*count))
        dispatch(counterActions.increment(-total)) 
        
    }
    
    return <div className="buildingArea">
        <h2 className="buildingTitle">Buildings</h2>
        {buildings.map((building)=> {
            return(
               <div className="buildingItem" key={building.key}>
                <p>{building.name}</p>
                {building.cps < 1000000 && <p>Amount per second: <span>{building.cps}</span></p>}
                {building.cps >= 1000000 && <p>Amount per second: <span style={{display:"none"}}>{building.cps}</span><span>{changeToLettering(building.cps)}</span></p>}
                {building.totalCps < 1000000 && <p><span style={{display:"none"}}></span>{building.totalCps / building.cps} building(s) producing {building.totalCps} per second</p>}
                {building.totalCps >= 1000000 && <p><span style={{display:"none"}}>{building.totalCps}</span>{building.totalCps / building.cps} building(s) producing {changeToLettering(building.totalCps)} per second</p>}
                {building.cost < 1000000 && <p>Cost: <span>{building.cost}</span></p>}
                {building.cost >= 1000000 && <p>Cost: <span style={{display:"none"}}>{building.cost}</span>{changeToLettering(building.cost)}</p>}
                <button onClick={addBuildingHandler} className="btn">Buy</button> 
                <button onClick={buyTenHandler} style={{"marginLeft": "20px"}} className="btn">Buy 10</button> 
                <button onClick={buyAllHandler} style={{"marginLeft": "20px"}} className="btn">Buy {priceAllHandler(building.cost)}</button> 
        </div>
)})}
    </div>
}

export default BuildingList