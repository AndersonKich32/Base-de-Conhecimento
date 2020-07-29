import React, { useState, useEffect } from 'react'
import './styles.css'
import { FaFolder, FaFile, FaUser } from "react-icons/fa";

export default function StatisticBox(props){
    const [icon, setIcon] = useState('')

    useEffect(()=>{
        const icons = props.icon 
        switch(icons){
            case 'FaFolder':
                setIcon(<FaFolder color={props.color} size={36}/>);
                break;
            case 'FaFile':
                setIcon(<FaFile color={props.color} size={36}/>);
                break;
            case 'FaUser':
                setIcon(<FaUser color={props.color} size={36}/>);
                break;
            default:
                setIcon(null)
        }
    },[])

    return(
        <div className='statistic-container'>
            <div className='statistic-icon'>
                {icon}
            </div>

            <div className='satistic-info'>
                <h3>{props.name}</h3>
                <h4>{props.number}</h4>
            </div>            
        </div>
    )
}