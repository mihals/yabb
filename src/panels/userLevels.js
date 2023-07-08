import React from "react";
import {Phaser} from "phaser";
import { useEffect } from "react";
import StartGame from "./startGame";
const a = Phaser;



export default function UserLevels({go}){
    
    // function initPhaser(){
    //     let a = Phaser.Cache;
    // }
    // useEffect(()=>{
    //     //  initPhaser();
    //     },[]
    // )
    
    return(
        <div>
            <h1>Список уровней.</h1>
            <button onClick={() => go("startGame")}>Старт.</button>
        </div>
    )
}