import React, { useState, useEffect } from 'react'
import './styles.css'
import User from '../admin pages/users'
import Category from '../admin pages/categories'
import Article from '../admin pages/articles'

export default function Tabs(){
    const noSelect = {inicial:'btnStandard', visi:'hidden', index: -1}
    const select = {inicial:'btnSelect', visi:'visible'}

    const [btn1, setBtn1] = useState(select)
    const [btn2, setBtn2] = useState(noSelect)
    const [btn3, setBtn3] = useState(noSelect)
    

    useEffect(()=>{
      
    },[])

    const click = (value) =>{
        value === 'Artigos' ? setBtn1(select) : setBtn1(noSelect)
        value === 'Categorias' ? setBtn2(select) : setBtn2(noSelect)
        value === 'Usuarios' ? setBtn3(select) : setBtn3(noSelect)
    }

    return(
        <div className='tabs-container'>
            <div className='tabs-title'>
                <ul className='tabs-title-ul'>

                    <li className='tabs-title-ul-li'>
                        <button className={`button ${btn1.inicial}`} 
                                value='Artigos' 
                                onClick={(e)=>click(e.target.value)}>Artigos
                        </button>
                    </li>
                    
                    <li className='tabs-title-ul-li'>
                        <button className={`button ${btn2.inicial}`} 
                                value='Categorias' 
                                onClick={(e)=>click(e.target.value)}>Categorias
                        </button>
                    </li>

                    <li className='tabs-title-ul-li'>
                        <button className={`button ${btn3.inicial}`} 
                                value='Usuarios' 
                                onClick={(e)=>click(e.target.value)}>Usuarios
                        </button>
                    </li>
                </ul>
            </div>

            <div className='pages-container'>
                <div className='page' style={{visibility:`${btn1.visi}`, zIndex: btn1.index}}>
                    <Article/>
                </div>

                <div className='page' style={{visibility:`${btn2.visi}`}}>
                    <Category/>
                </div>
                    
                <div className='page' style={{visibility:`${btn3.visi}`}}>
                    <User/>
                </div>
            </div>
        </div>
    )
}