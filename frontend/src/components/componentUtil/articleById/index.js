import React, {useEffect, useState} from 'react'
import api from '../../../services/api'
import './styles.css'
import Title from '../title'
import draftToHtml from 'draftjs-to-html';


export default function ArticleById(props){
    const [contentarticle, setContentArticle] = useState('')
    const [article, setArticle] = useState('')
    const token = localStorage.getItem('token')

    const handleloadArticleById=(id)=>{
        api.get(`/articles/${id}`, {
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{
            const content = draftToHtml(JSON.parse(response.data.content))           
            setContentArticle(content)
           setArticle({name:response.data.name, description:response.data.description})
        })
    }


    useEffect(()=>{
        const id = props.match.params.id
        handleloadArticleById(id)
    },[])

    return(
        <div className='articleById-container'>
            <Title title={article.name}
                subTitle={article.description}
                iconName='FaFolderOpen' 
            />

            <div contentEditable='true' className='articleById-content' dangerouslySetInnerHTML={{__html: contentarticle}}/>
        </div>
       
   
    )
}