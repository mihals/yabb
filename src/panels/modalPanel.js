import React from 'react'

export default function ModalPanel(props){
    let wnd = null;
    if(props.type == "msg"){
        wnd = (<div className='modal'>
        <div className='modalTxt'>{props.msg}</div></div>)
    }
    if (props.type == "prompt") {
        wnd = (<div className='modalPrompt'>
            <div className='modalPromptTxt'>{props.msg}</div>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                    <button className='modalPromptBtnPlay' onClick={(e) =>
                        document.getElementById('phaCont').dispatchEvent(new CustomEvent("introMsg", {
                            bubbles: true,
                            detail: {
                                type: "btnPlay",
                                text: "",
                                show: false
                            }
                        }))}>
                        Начать игру.</button>
                    <button className='modalPromptBtnLearn' onClick={props.handler}>
                        Повторить.</button>
            </div>
        </div>)
    }
    return(wnd)
}