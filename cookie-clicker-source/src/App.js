import BuildingList from './components/BuildingList';
import Clicker from './components/Clicker';
import UpgradeList from './components/UpgradeList';

import {Howl} from 'howler';

import chimes from "./audio/chimes.mp3"

import "./App.css"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { counterActions } from './store/store';

function App() {

  const dispatch = useDispatch()
  const cps = useSelector((state => state.cps))

  let [movedBlock, setMovedBlock] = useState({
    left: "-100px",
    top: "-100px",
    opacity: 0
  })

  let [movedTextGain, setMovedTextGain] = useState({
    left: "-100px",
    top: "-100px",
    opacity: 0
  })

  function positionChange() {
    const y = Math.floor(Math.random()*90) + 1
    const x = Math.floor(Math.random()*90) + 1

    setMovedBlock({
      left: x + "%",
      top: y + "%",
      opacity: 1
    })

    const specialBlock = document.getElementsByClassName("blockSpecial")[0]

    specialBlock.classList.add("blockTransition")
    setTimeout(() => {
      specialBlock.classList.remove("blockTransition") 

      setMovedBlock({
        left: "-100px",
        top: "-100px",
        opacity: 0
      })

  }, 30000)

  }

  useEffect(() => {
    setInterval(() => {
      positionChange()
    }, 120000)
  }, [])

  function specialBlockHandler() {

    const textGain = document.getElementsByClassName("hiddenTextGain")[0]

    dispatch(counterActions.increment(cps * 5))

    setMovedTextGain(movedBlock)

    setMovedBlock({
      left: "-100px",
      top: "-100px",
      opacity: 0})

    var sound = new Howl({
        src: [chimes],
        volume: 0.1
        });
    sound.play()

    textGain.classList.add("textTransition")
    setTimeout(() => {
      textGain.classList.remove("textTransition") 

      setMovedTextGain({
        left: "-100px",
        top: "-100px",
        opacity: 0
      })

  }, 3000)

    
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

  return (
    <Row className="spacing">
      {(cps * 5) < 1000000 && <span className="hiddenTextGain" style={movedTextGain}>{`Gained ${cps*5}`}</span>}
      {(cps * 5) >= 1000000 && <span className="hiddenTextGain" style={movedTextGain}>{`Gained ${changeToLettering(cps*5)}`}</span>}
      <div className="blockSpecial" style={movedBlock} onClick={specialBlockHandler}><p>Click<br/>me!</p></div>
      <Col lg={3} className="spacing">
        <BuildingList />
      </Col>
      <Col lg={6} className="spacing">
        <Clicker />
      </Col>
      <Col lg={3} className="spacing">
        <UpgradeList /> 
      </Col>
    </Row>
  );
}

export default App;
