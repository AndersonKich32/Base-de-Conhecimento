import React, {useState, useEffect} from 'react'
import api from '../../../../../../services/api'
import './styles.css'
import Toastify from '../../../../../../config/msgToastify'
import { FaTrash, FaPencilAlt  } from "react-icons/fa";

export default function Categoy(){
    const [parentId, setParentId] = useState(null)
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [toogleButton, setToogleBotton] = useState({class: '#005eff', value:'Salvar'})
    const [idCategory, setIdCategory] = useState('')
    const [nameSelectCategory, setNameSelectCategory] = useState('Selecione Uma Categoria')
    const token = localStorage.getItem('token')


    const updateListCategories = () => {
        api.get('/categories',{
            headers: {
                Authorization: token,
            }
        })
        .then(response => {
           
            setCategories(response.data)
        });
        
    }

    function handleNoRegister (e){
        e.preventDefault();
    }

    async function handleRegisterNewCategory(e){
        e.preventDefault();
        const id = idCategory

        const data = {
            name,
            parentId
        }
        
        if(id){
            try{
                const response = await api.put(`/categories/${id}`, data,{
                    headers: {
                        Authorization: token,
                    },
                });
                Toastify({type:'success', message:'Operação Realizada com Sucesso'})
                updateListCategories()
                setInputs()
            }catch(err){
                Toastify({type:'error', message:`${err.response.data}`})
            }
        }
        else{
            try{
                const response = await api.post('/categories', data,{
                    headers: {
                        Authorization: token,
                    },
                });
                Toastify({type:'success', message:'Operação Realizada com Sucesso'})
                updateListCategories()
                setInputs()
            }catch(err){
                Toastify({type:'error', message:`${err.response.data}`})
            }
        }
    }

    async function handleDeleteCategory(id){
        try{
            const response = await api.delete(`/categories/${id}`,{
                headers: {
                    Authorization: token,
                }
            });
            updateListCategories();           
            setToogleBotton({class: '#005eff', value:'Salvar'})
            Toastify({type:'success', message:'Operação Realizada com Sucesso'})
        }catch(err){            
            Toastify({type:'error', message:`${err.response.data}`})
        }
    }
    
    const setInputs=()=>{
        setName('')
        setIdCategory('')
        setParentId(null)
        setNameSelectCategory('Selecione Uma Categoria')
    }

    const confirmOrCancelDelete = (value) =>{
        if(value === 'Excluir'){
            handleDeleteCategory(idCategory)
            setInputs()
        }else if(value === 'Cancelar'){
            setToogleBotton({class: '#005eff', value:'Salvar'})
            setInputs()
        }else if(value === 'Update'){
            setToogleBotton({class: '#005eff', value:'Salvar'})
        }
    }

    const deleteCategory = (category)=>{
        setIdCategory(category.id)
        setNameSelectCategory(category.path)
        setName(category.name)
        setToogleBotton({class: '#e61919', value: 'Excluir'})  
    }

    const updateCategory = (category) =>{
        setName(category.name)
        setParentId(category.parentId)
        setNameSelectCategory(category.path)
        setIdCategory(category.id)
        setToogleBotton({class: '#006600', value: 'Update'}) 
    }

    const renderTbodyScroll =()=>{   
        return categories.map((category, index)=>(
            <tr key={index} >
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.path}</td>
                <td>
                    <div className='tbody-button-box'>
                    <div className='tbody-button-icon' style={{backgroundColor:'#cccc00'}} onClick={() => updateCategory(category)}>
                      <FaPencilAlt size={10} color='#000'   />
                    </div>
  
                    <div className='tbody-button-icon' style={{backgroundColor:'#e61919'}} onClick={() => deleteCategory(category)}>
                      <FaTrash size={10} color='#fff'  />
                    </div>
                    </div>
                </td>              
            </tr>
        ))  
      }

    const renderSelectOptions = () =>{
        return categories.map((category, index)=>(
        <option key={index} value={category.id}>{category.path}</option>
        ))
    }

    useEffect(()=>{
        updateListCategories()
    },[])

    return(
        <div className='category-container'>
            <form className='category-form' onSubmit={toogleButton.value !== 'Excluir' ? handleRegisterNewCategory : handleNoRegister}>
            <label htmlFor='category-name'>Nome:</label>
            <input  type='text'
                    value={name}
                    onChange={e => setName(e.target.value)} 
                    id='category-name' 
                    placeholder='Informe o Nome da categoria'/>

            <label>Categoria Pai</label>
            <select onChange={e => setParentId(e.target.value)}>
                <option value= {parentId}>{nameSelectCategory}</option>
                {renderSelectOptions()}
            </select>

            <div className='button-box-category'>
                <input  className="button-form-category" 
                        style={{background: `${toogleButton.class}`}} 
                        type='submit' 
                        value={toogleButton.value}
                        onClick={e => confirmOrCancelDelete(e.target.value)}/>

                <input  className="button-form-category" 
                        type="button"
                        style={{background: '#3f3f3f'}} 
                        value="Cancelar"
                        onClick={e => confirmOrCancelDelete(e.target.value)}/>
                    </div>                  
          </form>



          <div className='table-container-categories'>
                <div className='theade-categories'>              
                        <div className='theade-categories-th'>Código</div>
                        <div className='theade-categories-th'>Nome</div>
                        <div className='theade-categories-th'>Caminho</div>
                        <div className='theade-categories-th'>Ações</div>                     
                    </div>
                <div className='scroll-table-categories'>
                    <table className='categories-table'>
                        <tbody>
                            {renderTbodyScroll()}
                        </tbody>
                    </table>
                </div> 
            </div>
            <Toastify/>   
        </div>
    )
}