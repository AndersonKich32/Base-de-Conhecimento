import React, { useState, useEffect } from 'react'
import './styles.css'
import Header from './header'
import Menu from './menu'
import Content from './conteudo'
import Footer from './footer'


export default function Template(props){
    const [rotate, setRotate] = useState(0)
    const [hideMenu, setHideMenu] = useState('')
    const [changeWidth, setChangeWidth] = useState('')
    const [toogle, setToogle] = useState(false)

    const toogleState = () => {
        toogle === false ? setToogle(true) : setToogle(false)
        rotateIcon()
        setMenuAndContent()
    }

    const rotateIcon = () =>{
        toogle === false ? setRotate(0) : setRotate(-90)
    }
    
    const setMenuAndContent = () => {
        toogle === false ? setHideMenu('') : setHideMenu('hide')
        toogle === false ? setChangeWidth('') : setChangeWidth('new-width')
    }
    
     

    return(
       
        <div className='template-container'>
            
                <Header title={'Base de conhecimento'} 
                        rotate={rotate} 
                        function={toogleState}
                />

                <Menu hideMenu={hideMenu}/> 

                <Content changeWidth={changeWidth} info={props.data}/>
               
                <Footer changeWidth={changeWidth}/>   
        </div>
  
   
    )
}