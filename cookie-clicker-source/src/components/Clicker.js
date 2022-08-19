import React from 'react';

import Button from 'react-bootstrap/Button'
import classes from "./Clicker.module.css"

import {Howl} from 'howler';

import pop_1 from "../audio/pop_1.mp3"
import pop_2 from "../audio/pop_2.mp3"
import pop_3 from "../audio/pop_3.mp3"
import pop_4 from "../audio/pop_4.mp3"

import { counterActions } from '../store/store'

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"

function Clicker() {

    const counter = useSelector((state) => state.counter)
    const cps = useSelector((state) => state.cps)
    const dispatch = useDispatch();
    let isFocused = document.hasFocus()

    function incrementHadler() {
        dispatch(counterActions.increment(1))
        
        // play random sound out of 4
        const randomSound = Math.floor(Math.random() * 4 + 1);
        switch(randomSound){
            default:
                var sound = new Howl({
                    src: [pop_1],
                    volume: 0.05
                    });
                sound.play()
                break;
            case 1: 
                var sound1 = new Howl({
                    src: [pop_1],
                    volume: 0.05
                    });
                sound1.play()
                break;
            case 2: 
            var sound2 = new Howl({
                src: [pop_2],
                volume: 0.05
                });
            sound2.play()
            break;
            case 3: 
            var sound3 = new Howl({
                src: [pop_3],
                volume: 0.05
                });
            sound3.play()
            break;
            case 4: 
            var sound4 = new Howl({
                src: [pop_4],
                volume: 0.05
                });
            sound4.play()
            break;
        }          
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
        // Adds clicks per second in a 1 increment to make the counter fluid
        if(cps === 0) {
            return
        }
        if(isFocused && cps < 100){
            const interval = setInterval(() => {
                dispatch(counterActions.increment(1))
                
              },1000/cps);
              return () => clearInterval(interval);
        }
        // bypasses issues with counter being too slow past 10 millisecond additions, divided by 9 to keep the appearance if adding to the counter smoothly
        if(isFocused && cps >= 100){
            const newCps = Math.floor(cps/9)
            const interval = setInterval(() => {
                dispatch(counterActions.increment(newCps))
                
              }, 108);
              return () => clearInterval(interval);
        }
        // When page is not focused, adds per second instead of doing all the calculations above.
        // Rounds up to nearest cps add, so you finish that second's cps add before you starts the counter back to 1000ms
        else{
            const roundUp = (Math.round(counter/5) *5) - counter;
            dispatch(counterActions.increment(roundUp))
            const interval = setInterval(() => {
                dispatch(counterActions.increment(cps))
              }, 1000);
              return () => clearInterval(interval);
        }
            
    }, [cps, dispatch, isFocused])

    return <div className={classes.clickerArea}>
        <div className={classes.clickerHud}>
            {counter < 1000000 && <h2>{counter}</h2>}
            {counter >= 1000000 && <h2>{changeToLettering(counter)}</h2>}

            {cps < 1000000 && <h2>Clicks per second : {cps}</h2>}
            {cps >= 1000000 && <h2>Clicks per second : {changeToLettering(cps)}</h2>}
            <Button onClick={incrementHadler} className={classes.clickerButton}>Click!</Button>
        </div>
        <a href="https://www.flaticon.com/free-icons/cookie" style={{"position" : "absolute" ,"bottom": 0, "left": 0, "fontSize": "12px", "color": "black"}} title="cookie icons">Cookie icons created by Freepik - Flaticon</a>
    </div>
}

export default Clicker