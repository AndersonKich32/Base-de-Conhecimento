import React, { useState } from 'react'
import './styles.css'

export default function Footer (props){
    const [footer, setFooter] = useState('')

    return(
        <footer className={`footer-container ${props.changeWidth}`}>
            <span>Copyright <strong>kich</strong> 2019-2020 </span>
        </footer>
    )
}