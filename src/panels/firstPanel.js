import React from 'react'
import place1 from '../img/place1.png'
import place2 from '../img/place2.png'
import place3 from '../img/place3.png'

export default function FirstPanel({ go }) {
    return (
        <div className='container'>
            <div className='header'>
                <h1 style={{ paddingLeft: "1rem" }}>Шарики за ролики.</h1>
            </div>
            <div className='content'>
                <div className='buttonsContainer'>
                    <div><button className='buttonPlay' onClick={(e)=>go('secondPanel')} >Начать игру.</button></div>
                    <div><button className='buttonLearn'>&nbsp;Обучалка.&nbsp;</button></div>
                </div>
                <div className='leadersList'>
                    <div className='grayTitle'>ВАШ РЕЗУЛЬТАТ.</div>
                    <div style={{ margin: '0.8rem' }}>Mikhail Salnikov 400 баллов.</div>
                </div>
                <div className='separator'></div>
                <div className='grayTitle'>ВАШ РЕЙТИНГ.</div>
                <div style={{ margin: '0.8rem' }}>1 место.</div>
                <div className='separator'></div>
                <div className='grayTitle'>ЛИДЕРЫ.</div>
                <div className='leaderCell'>
                    <div className='leaderInfo'>
                        <div className='placeImg'><img src={place1} style={{ width: "48px" }} /></div>
                        <div className='leaderTextInfo'>
                            <div className='nameBalls'>
                                <div className='nameInfo'>Mikhail Salnikov</div>
                                <div className='ballsInfo'>400 баллов</div>
                            </div>
                            <div className='placeInfo'>Место 1.</div>
                        </div>
                    </div>
                </div>

                <div className='leaderCell'>
                    <div className='leaderInfo'>
                        <div className='placeImg'><img src={place2} style={{ width: "48px", height: "48px" }} /></div>
                        <div className='leaderTextInfo'>
                            <div className='nameBalls'>
                                <div className='nameInfo'>Мелисса Пончо.</div>
                                <div className='ballsInfo'>300 баллов</div>
                            </div>
                            <div className='placeInfo'>Место 2.</div>
                        </div>
                    </div>
                </div>

                <div className='leaderCell'>
                    <div className='leaderInfo'>
                        <div className='placeImg'><img src={place3} style={{ width: "48px" }} /></div>
                        <div className='leaderTextInfo'>
                            <div className='nameBalls'>
                                <div className='nameInfo'>Гаспар Копейкин.</div>
                                <div className='ballsInfo'>200 баллов</div>
                            </div>
                            <div className='placeInfo'>Место 3.</div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>)
}