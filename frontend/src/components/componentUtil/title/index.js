import React, {useState, useEffect} from 'react'
import './styles.css'
import { FaHome, FaCogs, FaRegFolder, FaRegFolderOpen, FaFile} from "react-icons/fa";


export default function Title(props){
    const [icon, setIcon] = useState('')

    useEffect(() => {
        const icon = props.iconName
        if(icon === 'FaHome'){
            setIcon(<FaHome/>)
        }
        else if(icon === 'FaCogs'){
            setIcon(<FaCogs/>)

        }else if(icon === 'FaRegFolder'){
            setIcon(<FaRegFolder/>)
        }
        else if(icon === 'FaFolderOpen'){
            setIcon(<FaRegFolderOpen/>)
        }
        else{
            setIcon(<FaFile/>)
        }

        
    },[])


    return(
        <div className='title-container'>
            <div className='title-box'>
                {icon}
                <h1>{props.title}</h1>
            </div> 

            <div className='subTitle-box'>
                <h2>{props.subTitle}</h2>           
            </div>  
            <hr/>                    
        </div>
    )
}