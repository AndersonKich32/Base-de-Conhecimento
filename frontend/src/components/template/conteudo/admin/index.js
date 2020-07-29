import React from 'react'
import './styles.css'
import Title from '../../../componentUtil/title'
import Tabs from './tabs'


export default function Admin(){
   

    return(
        <div className='admin-container'>
            <Title  title='Administração do Sistema'
                    subTitle='Cadastro e Cia' 
                    iconName='FaCogs'/>

            <div className='admin-tabs'>
                <Tabs/>
            </div>
        </div>
    )
}