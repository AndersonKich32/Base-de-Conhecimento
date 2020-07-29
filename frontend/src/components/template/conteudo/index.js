import React from 'react'
import './styles.css'
import Router from '../../../router'

export default function Content (props){
    
    return(
        <div className={`content-container ${props.changeWidth}`} >
           
          <Router/>
           
        </div>
    )
}