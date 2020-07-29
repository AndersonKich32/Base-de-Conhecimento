import React, { useState, useEffect } from 'react'
import './styles.css'
import Title from '../../../componentUtil/title'
import StatisticBox from './statisticBox'
import api from '../../../../services/api'


export default function Dashbord(props){
    const [statisticData, setStatisticData] = useState([]) 
    const token = localStorage.getItem('token')

    const [articles, setArticles] = useState([])
    const [categories, setCategories] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
       
        handleListCategories()
        handleListArticles()
        handleListUser()
    },[])

    

    const handleListCategories=()=>{
        api.get('/categories', {
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{
            setCategories(response.data.length)
        })             
    }

    const handleListArticles=()=>{
        api.get(`/articles`, {
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{          
            setArticles(response.data.count)
        })
    }

    const handleListUser=()=>{
      
        api.get('/users',{
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{           
            setUsers(response.data.length)          
        })        
    }








    return(
        <div className='dashbord-container'>
            <Title title='Dashbord'
                   subTitle='Base de Conhecimento'
                   iconName='FaHome' 
            />

        <div className='statistic-box'>
            <StatisticBox name='Categorias' number={categories} icon='FaFolder' color='#d54d50'/>
            <StatisticBox name='Artigos' number={articles} icon='FaFile' color='#3bc480'/>
            <StatisticBox name='Usuarios' number={users} icon='FaUser' color='#3282cd'/>
           </div>
           
        </div>
    )
}