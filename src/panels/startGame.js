import React from 'react'

export default function StartGame({go}){
    return(
        <div className='container'>
            <div>
                <h1>Шарики за ролики..</h1>
            </div>
        
        <button onClick={() => go("firstPanel")}></button>
        </div>
        
    )
}