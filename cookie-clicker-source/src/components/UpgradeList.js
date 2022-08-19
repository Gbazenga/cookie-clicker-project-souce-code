import classes from "./UpgradeList.module.css"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { counterActions } from "../store/store"

function UpgradeList() {

    const dispatch = useDispatch()
    const upgrades = useSelector((state) => state.upgrades)
    const counter = useSelector((state) => state.counter)

    function upgradeHandler(event) {
        event.preventDefault()
        const target = event.target.parentElement;
        const cost = Number(target.children[1].children[0].textContent)
        const upgradeName = target.children[2].children[0].textContent

        console.log(cost)

        dispatch(counterActions.upgradeCalc(upgradeName))
        dispatch(counterActions.increment(-cost))
    }

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

    useEffect(() => {
        const items = document.getElementsByClassName(classes.upgradeItem)
        for(const item of items){
            const buttons = item.getElementsByClassName(classes.buyBtn)
            if(item.children[1].children[0].textContent > counter){  
                buttons[0].disabled = true
                buttons[1].disabled = true
            }else{
                buttons[0].disabled = false
                buttons[1].disabled = false
            }
        }
    }, [counter])

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
            for(count; total <= counter; count++){
                prevValue = prevValue*3
                total += prevValue;
            }

        return count
        }

    }

    function buyAllHandler(event) {
        //buys multiple buildings at once
        const target = event.target.parentElement;
        const cost = Number(target.children[1].children[0].textContent)
        const upgradeName = target.children[2].children[0].textContent

        let total = 0;
        let prevValue = cost;
        let counterSnap = counter
        let count = 0;

        
        for(count; prevValue <= counterSnap; count++){
            total += prevValue;
            counterSnap -= prevValue;
            prevValue = prevValue*3

            console.log(total)
  
            dispatch(counterActions.upgradeCalc(upgradeName))
        }

        dispatch(counterActions.increment(-total))
        
    }

    return <div className={classes.upgradeArea}>
        <h2 className={classes.upgradeTitle}>Upgrades</h2>
        {upgrades.map((upgrade) => {
            return(
        <div className={classes.upgradeItem} key={upgrade.key}>
            <p>{upgrade.name}</p>
            { upgrade.cost < 1000000 && <p>Cost: <span>{upgrade.cost}</span></p>}
            { upgrade.cost >= 1000000 && <p>Cost: <span style={{display:"none"}}>{upgrade.cost}</span><span>{ changeToLettering(upgrade.cost)}</span></p>}
            <p>Doubles Production of <span>{upgrade.target}</span> </p>
            <p>Times Bought : {upgrade.timesBought}</p>
            <button onClick={upgradeHandler} className={classes.buyBtn}>Buy</button>
            <button onClick={buyAllHandler} style={{"marginLeft": "20px"}} className={classes.buyBtn}>Buy {priceAllHandler(upgrade.cost)}</button> 
        </div>)
        })}
    </div>
}

export default UpgradeList