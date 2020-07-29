import React, { useState, useEffect } from 'react'
import './styles.css'
import api from '../../../../../../services/api'
import Toastify from '../../../../../../config/msgToastify'
import { FaTrash, FaPencilAlt, FaAngleLeft  } from "react-icons/fa";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ColorPi from './colorPicker'

export default function Article(){
   
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState(null)
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState(null)
    const [authorSelect, setAuthorSelect] = useState('Informe o nome do author')
    const [categorySelect, setCategorySelect] = useState('Informe a categoria')
    const [articles, setArticles] = useState([])
    const [articleId, setArticleId] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl,setImageUrl] = useState(null)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(2)
    const [setButton, setSetBotton] = useState('')
    const [editorContent, setEditorContent] = useState(EditorState.createEmpty())
    const [content, setContent] = useState('')
    const [preview, setPreview] = useState('preview-hide')
    const [contentPreview, setContentPreview] = useState('')
    const token = localStorage.getItem('token')

    function handleNoRegister (e){
        e.preventDefault();
    }

    const handleListUser=()=>{
      
        api.get('/users',{
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{
            const users = response.data.map(user =>{
                return {id:user.id, name:`${user.name} - ${user.email}`}
            })
            setUsers(users)          
        })        
    }

    const handleListCategories=()=>{
        api.get('/categories', {
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{
            setCategories(response.data)
        })             
    }

    const handleListArticles=(pageNex)=>{

        let pageAux = 0

        if(pageNex === true){
             pageAux = page +1
             if(pageAux >= count){
                 pageAux = count
             }           
            setPage(pageAux)
        }else{
             pageAux = page -1
             if(pageAux === 0){
                 pageAux = 1
             }
            setPage(pageAux)
        }
        

        api.get(`/articles?page=${pageAux}`, {
            headers: {
                Authorization: token,
            },
        })
        .then(response =>{          
            setArticles(response.data.data)
            const aux = Math.ceil(response.data.count/10)
            setCount(aux)                     
        })
    }

    async function handleRegisterNewArticle(e){
        e.preventDefault();
        const id = articleId
        
        const data={
            name,
            description,
            categoryId,
            userId,
            content,
            imageUrl   
        }
       
        if(id){
            try{
                const response = await api.put(`/articles/${id}`, data,{
                    headers: {
                        Authorization: token,
                    },
                });
                Toastify({type:'success', message:'Operação Realizada com Sucesso'})
                handleListArticles()                
                changeButton()             
            }catch(err){
                Toastify({type:'error', message:`${err.response.data}`})
            }
        }else{
            try{
                const response = await api.post('/articles', data,{
                    headers: {
                        Authorization: token,
                    },
                });
                Toastify({type:'success', message:'Operação Realizada com Sucesso'})
                handleListArticles()               
            }catch(err){
                Toastify({type:'error', message:`${err.response.data}`})
            }
        }
    }

   async function handleDeleteArticle(id){
      try{
        const response = await api.delete(`/articles/${id}`,{
            headers: {
                Authorization: token,
            }
           });
           Toastify({type:'success', message:'Artigo Deletado com Sucesso'})
           changeButton()
           handleListArticles()
           setInputs()
      }catch(err){
           Toastify({type:'error', message:`${err.response.data}`})
      }
   }

    const setCategorySelectOrUserSelect=(array, id)=>{
        let response =''
     array.forEach((elemento) =>{
            if(elemento.id === id){
               response = elemento.name
            }
         });
         return response
    }

    const serializedContentArticle=(content)=>{
        let json = JSON.stringify(content);
        let converted = JSON.parse(json);    
        const decoder = new TextDecoder("utf-8");
        const array = new Uint8Array(converted)
        const response = decoder.decode(array)      
        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(response)))
        setEditorContent(editorState)   
    }

    const updateOrDeleteArticle = (article, action) =>{
        serializedContentArticle(article.content.data)
        setArticleId(article.id)
        setName(article.name)
        setImageUrl(article.imageUrl)
        setDescription(article.description)
        setCategoryId(article.categoryId)
        setUserId(article.userId)
        setCategorySelect(setCategorySelectOrUserSelect(categories,article.categoryId))
        setAuthorSelect(setCategorySelectOrUserSelect(users,article.userId))
        action === 'Update' ? changeButton('Update') : changeButton('Excluir') 
    }

    const confirmOrCancelDelete = (value) =>{
        if(value === 'Excluir'){
            handleDeleteArticle(articleId)
        }else if(value === 'Cancelar'){
            changeButton()
            setInputs()
        }
    }
  
    useEffect(()=>{
        changeButton()
        nextPage()   
        handleListUser()  
        handleListCategories()
    },[])

    const renderSelectOptionsCategories = () =>{
       return categories.map((category, index)=>(
       <option key={index} value={category.id}>{category.path}</option>
        ))
    };

    const renderSelectOptionsUsers = () =>{
        return users.map((user, index)=>(
        <option key={index} value={user.id}>{user.name}</option>
         ))
    };

    const renderTbodyScroll = () =>{
        return articles.map((article, index)=>(
            <tr key={index} >
            <td>{article.id}</td>
            <td>{article.name}</td>
            <td>{article.description}</td>
            <td>
                <div className='tbody-button-box'>
                <div className='tbody-button-icon' style={{backgroundColor:'#cccc00'}} onClick={() => updateOrDeleteArticle(article, 'Update')}>
                  <FaPencilAlt size={10} color='#000' />
                </div>

                <div className='tbody-button-icon' style={{backgroundColor:'#e61919'}}  onClick={() => updateOrDeleteArticle(article, 'Excluir')}>
                  <FaTrash size={10} color='#fff'  />
                </div>
                </div>
            </td>              
        </tr> 
        ))
    }

    const changeButton = (value) =>{
        switch(value){
            case 'Update':
                setSetBotton({color: '#006600', value:'Update'});
                break;
            case 'Excluir':
                setSetBotton({color: '#e61919', value:'Excluir'});
                break;
            default:
                setSetBotton({color: '#005eff', value:'Salvar'});
        }
    }

    const setInputs = () =>{
        setArticleId('')
        setName('')
        setDescription('')
        setCategoryId('')
        setUserId('')
        setEditorContent(EditorState.createEmpty()) 
        setCategorySelect('Informe o nome do author')
        setAuthorSelect('Informe a categoria')
    }

    const previewPage = () =>{
         
        handleListArticles(false)
        
    }

    const nextPage = () =>{
      
        handleListArticles(true)
        
    }
    
   function _uploadImageCallBack(file){  
        const imageObject = {
          file: file,
          localSrc: URL.createObjectURL(file),
        }
    
        return new Promise(
          (resolve, reject) => {
            resolve({ data: { link: imageObject.localSrc, file:imageObject.file } });
          }
        );
   }
   
    
    return(
        <div className='article-container'>
            <form className='articles-form' onSubmit={setButton.value !== 'Excluir' ? handleRegisterNewArticle : handleNoRegister}>
                <label htmlFor='article-name'>Nome:</label>
                <input  id='article-name' 
                        type='text'
                        placeholder='Informe o Nome do Artigo'
                        value={name}
                        onChange={e => setName(e.target.value)}/>

                <label htmlFor='article-description'>Descrição:</label>
                <input  id='article-description' 
                        type='text'
                        placeholder='Informe a Descrição do Artigo'
                        value={description}
                        onChange={e => setDescription(e.target.value)}/>

                <label htmlFor='article-image-url'>Imagem (URL):</label>
                <input  id='article-image-url'
                        type='text' 
                        placeholder='Informe a URL da Imagem do Artigo'
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}/>

                <label>Categoria:</label>
                <select onChange={e => setCategoryId(e.target.value)}>
                    <option value={categoryId}>{categorySelect}</option>
                    {renderSelectOptionsCategories()}
                </select>

                <label>Author</label>
                <select onChange={e => setUserId(e.target.value)}>
                    <option value={userId}>{authorSelect}</option>
                    {renderSelectOptionsUsers()}
                </select>

                <label>Conteúdo:</label>               
                <Editor 
                 
                     editorState={editorContent}
                     wrapperClassName="wrapper-class"
                     editorClassName="editor-class"
                     toolbarClassName="toolbar-class"
                     wrapperStyle={{ border: "2px solid #DDDDDD", marginBottom: "20px" }}
                     editorStyle={{ minHeight: "200px", padding: "10px"}}
                     toolbar={{
                        colorPicker: { component: ColorPi },
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback:_uploadImageCallBack,
                            alt: { present: true, mandatory: true },
                            previewImage: true,
                            urlEnabled: true,
                            uploadEnabled:true,
                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg' },
                        }}
                    onEditorStateChange={editorState =>{ 
                        const convertContent = convertToRaw(editorState.getCurrentContent())
                        const previewHtml = draftToHtml(convertContent)
                        console.log(previewHtml)
                        setContentPreview(previewHtml)   
                        setContent(convertContent)
                        setEditorContent(editorState)}
                    }/>
               
                <div className='button-box-article'>
                    <input style={{background: `${setButton.color}`}} type='submit' className='button-form-article' value={setButton.value} onClick={e =>confirmOrCancelDelete(e.target.value)}></input>
                    <input type="button" style={{background: '#3f3f3f'}}   className='button-form-article' value='Cancelar' onClick={e =>confirmOrCancelDelete(e.target.value)}></input>
                    <input type="button" style={{background: '#cbcf00', color:'#777'}}   className='button-form-article' value='Preview' onClick={()=>  setPreview('preview-visible')}></input>
                </div>
            </form>

            <div className='table-container-articles'>
                <div className='theade'>              
                        <div className='theade-th'>Código</div>
                        <div className='theade-th'>Nome</div>
                        <div className='theade-th'>Descrição</div>
                        <div className='theade-th'>Ações</div>                     
                    </div>
                <div className='article-scroll-table'>
                    <table className='article-table'>
                        <tbody>
                            {renderTbodyScroll()}
                        </tbody>
                    </table>
                </div> 
            </div>

            <div className='paginate-container'>
                <input  className='btnChangePages' onClick={previewPage} value='<<'/>
                <span type='button' className='display-page'>{page}</span>
                <input className='btnChangePages' onClick={nextPage}value='>>'/>
           </div>          
            <Toastify/>

            <div className={`preview ${preview}`}>
                <div className='preview-icon'>
                    <FaAngleLeft size={30} color='#777' onClick={() => setPreview('preview-hide')}/>
                </div>

                <div contentEditable='true' className='articleById-content' dangerouslySetInnerHTML={{__html: contentPreview}}/>
            </div>

        </div>
    )
}