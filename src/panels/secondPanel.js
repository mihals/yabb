import React from 'react'
import enable from '../img/enable.png'
import disable from '../img/disable.png'

export default function SecondPanel({ go }) {
    return (
        <div className='listContainer'>
            <div className='header'>
                <h1 style={{ paddingLeft: "1rem" }}>Шарики за ролики.</h1>
            </div>
            <div className='listContent'>
                <h1>Second Panel</h1>
                <div className='listItem' onClick={(e)=>go(1)}>
                <div className='itemImg'><img src={enable} style={{ width: "48px",marginLeft:'1rem' }} /></div>
                <div className='listText' style={{verticalAlign: 'center'}}>Уровень 1. У вас 200 баллов.</div>
                <span className='roleButton'></span>
                </div>
                <div className='listItem'>
                <div className='itemImg'><img src={disable} style={{ width: "48px" }} /></div>
                <div className='listText'>Уровень 2. Недоступен.</div>
                </div>
                <div className='listItem'>
                <div className='itemImg'><img src={disable} style={{ width: "48px" }} /></div>
                <div className='listText'>Уровень 3. Недоступен.</div>
                </div>
                <div className='listItem'>
                <div className='itemImg'><img src={disable} style={{ width: "48px" }} /></div>
                <div className='listText'>Уровень 4. Недоступен.</div>
                </div>
                <div className='listItem'>
                <div className='itemImg'><img src={disable} style={{ width: "48px" }} /></div>
                <div className='listText'>Уровень 5. Недоступен.</div>
                </div>
                <div className='listItem'>
                <div className='itemImg'><img src={disable} style={{ width: "48px" }} /></div>
                <div className='listText'>Уровень 6. Недоступен.</div>
                </div>
            </div>
        </div>)
}