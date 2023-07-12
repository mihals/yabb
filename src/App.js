import React from "react";
import FirstPanel from "./panels/firstPanel";
import SecondPanel from "./panels/secondPanel";
import GamePanel from "./panels/gamePanel";
import ModalPanel from "./panels/modalPanel";
import { useState, useEffect } from "react";
import "./index.css"
import { createPortal } from "react-dom";

// Add this in node_modules/react-dom/index.js
//window.React1 = require('react');

// Add this in your component file
// require('react-dom');
// window.React2 = require('react');
// console.log("Сравниваем реакты" + (window.React1 === window.React2));



function App() {
   useEffect(() => {
    window.addEventListener('introMsg', e => {
      if(e.detail.type == "msg"){
        setIntroType("msg");
        if(e.detail.text) setModalTxt(e.detail.text);
        setModal(e.detail.show);
      }
      if(e.detail.type == "prompt"){
        setIntroType("prompt");
        if(e.detail.text) setModalTxt(e.detail.text);
        setModal(e.detail.show);
        //window.myManager.myGB.clearIntro();
      }
      if(e.detail.type == "btnPlay"){
        setModal(false);
      }
      // if(e.detail.type == "btnLearn"){
      //   //setModal(false);
      //   showIntro();
      //   //window.myManager.myGB.startIntro();
      // }
    })

    
    
   },[])

  const [activePanel, setPanel] = useState(<FirstPanel go={changePanel}/>);
  const [numLevel, setLevel] = useState(0);
  const [showModal, setModal] = useState(false);
  const [modalTxt, setModalTxt] = useState('Modal Message');
  const [introType, setIntroType] = useState("msg");
  
  function showIntro(){
      window.myManager.myGB.clearIntro();
          //setLevel(0);
          window.myManager.myGB.startIntro();
    }

  function changePanel(val){
    if(val == "secondPanel"){
      setPanel(<SecondPanel go={changePanel}/>);
    }
    else{
      setLevel(val)
      setPanel(<GamePanel nLevel={numLevel}/>);
    }
  }

  

  

  return (
    <>
    {activePanel}
    {showModal && <ModalPanel handler={showIntro} type={introType} msg={modalTxt}/>}
    </>
  );
}

export default App;
