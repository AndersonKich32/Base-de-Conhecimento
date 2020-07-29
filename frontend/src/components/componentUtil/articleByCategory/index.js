import React, { useEffect, useState } from 'react'
import api from '../../../services/api'
import imageDefault from '../../../assets/article.jpg'
import { Link } from 'react-router-dom'
import Title from '../title'
import './styles.css'

export default function ArticlesByCategory(props){
    const [category, setCategory] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [page, setPage] = useState(1)
    const [articles, setArticles] = useState([])
    const [loadMore, setLoadMore] = useState('visible') 
    const token = localStorage.getItem('token')
   
    useEffect(()=>{   
       update()   
    },[])


   const update=()=>{
       const id = props.match.params.id
    setCategoryId(id)
    handleLoadCategories(id)
    handleListarticles(id)
   }

    const handleLoadCategories = (id) =>{
        api.get(`/categories/${id}`, {
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{
            setCategory(response.data)
        })
    }

    const handleListarticles = (id) =>{
        api.get(`/categories/${id}/articles?page=${page}`, {
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{
            setArticles(articles.concat(response.data))
            setPage(page+1)
            if(response.data.length === 0) setLoadMore('hidden')   
        })
    }

    const setImage=(image)=>{
        if(image !== null){
            return (<img src={image} alt=""/>)
        }else{
            return(<img src={imageDefault} alt=""/>)
        }
        
    }

    const listArticles = (articles)=>{
        return articles.map((article, index)=>(
        <li key={index}>
            <Link className='link' to={`/app/articles/${article.id}`}>
            <div className='article-box'>
              
                <div className='article-img'>
                    {setImage(article.imageUrl)}
                </div>

                <div className='article-details'>
                    <div className='title-description'>
                        <h1>{article.name}</h1>
                        <h2>{article.description}</h2>
                    </div>
                    
                    <div className='author'>
                        <h3><strong> Author: </strong>{article.author}</h3>
                    </div>
                </div>               
            </div>
            </Link>
        </li>
        ))
    }


    return(

        <div className='articlesByCategory-container'>
           
            <Title title={category.name}
                subTitle='Categoria'
                iconName='FaRegFolder' 
            />
           
            <ul className='articlesByCategory-ul'>
                {listArticles(articles)}
            </ul>

            <div className='loadMore-box'>
                <button style={{visibility:`${loadMore}`}} onClick={()=>handleListarticles(categoryId)}>Carregar Mais Artigos</button>
            </div>
        </div>

        
    )
}