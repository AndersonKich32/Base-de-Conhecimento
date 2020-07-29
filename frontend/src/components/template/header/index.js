import React, {useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './styles.css'
import {} from 'react-gravatar'
import { FiChevronLeft, FiChevronDown, FiLogOut } from 'react-icons/fi'
import { FaCogs } from "react-icons/fa";

export default function Header(props){
    
    const [useImg, setUseImg] = useState('')
    const history = useHistory();
    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    
   const getImageGravatar = () =>{
       const userEmail = email
       const Url = `https://www.gravatar.com/avatar/${userEmail}?d=wavatar `
       setUseImg(Url)
   }

    useEffect(() =>{
     props.function()
     getImageGravatar()
    },[])

    function handleLogout(){
        localStorage.clear();
        history.push('/');
    }

    return(
        <header className='header-container'>
                <div className='icon' onClick={props.function} style={{transform:`rotate(${props.rotate}deg)`}}>
                    <FiChevronLeft size={30} color='#fff'/>
                </div>

                <h1 className='title'>
                    <Link className='link-title' to='/app/dashbord' >{props.title}</Link>
                </h1>

                <div className='user-dropdow'>
                    <span>{name}</span>
                    <div className='user-img'>
                        <img src={`${useImg}`} alt='avatar'/>
                    </div>
                    <FiChevronDown size={20} color='#fff'/>
                </div>

                <div className='user-content'>
                        <Link className='link-button' to='/app/admin' ><FaCogs size={16} color='#000'/>Administração</Link>                       
                        <Link className='link-button' onClick={handleLogout}><FiLogOut size={16} color='#000'/>Sair</Link>
                </div>               
        </header>
    )
}