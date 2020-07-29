import React, {useState, useEffect} from 'react'
import api from '../../../../../../services/api'
import './styles.css'
import Toastify from '../../../../../../config/msgToastify'
import { FaTrash, FaPencilAlt  } from "react-icons/fa";

export default function User(){
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [admin, setAdmin] = useState(false)
    const [comfirmPassword, setComfirmPassword] = useState('')
    const [toogleButton, setToogleBotton] = useState({class: '#005eff', name:'Salvar'})
    const token = localStorage.getItem('token')

    const updateListUsers = ()=>{
        api.get('/users',{
            headers: {
            Authorization: token,
        }
        })
        .then(response =>{  
            setUsers(response.data)
        })
    }

    function handleNoRegister (e){
        e.preventDefault();
    }

    async function handleRegister(e){
        e.preventDefault();
        const id = userId.id

        const data ={
            name,
            email,
            password,
            comfirmPassword,
            admin
        }

        if(id){
            try{
                const response = await api.put(`/users/${id}`, data,{
                    headers: {
                        Authorization: token,
                    }
                });
                Toastify({type:'success', message:'Update realizado com sucesso!'})
                updateListUsers()
                setInputs()
            }catch(err){
                Toastify({type:'error', message:`${err.response.data}`})
            }
        }

        try{
            const response = await api.post('/users', data,{
                headers: {
                    Authorization: token,
                }
            });
            Toastify({type:'success', message:'Operação Realizada com Sucesso'})
            updateListUsers()
            setInputs()
        }catch(err){
            Toastify({type:'error', message:`${err.response.data}`})
            setInputs()
        }
        
    }

    async function handleDelete(id){
       try{
        const response = await api.delete(`/users/${id}`, {
            headers: {
                Authorization: token,
            }
        });
        updateListUsers()
        setInputs()
        Toastify({type:'success', message:'Operação Realizada com Sucesso'})
        setToogleBotton({class: '#005eff', name:'Salvar'})
       }catch(err){
        Toastify({type:'error', message:`${err.response.data}`})
       }
    }

    const deleteUser = (user) => {
        setName(user.name)
        setEmail(user.email)
        setUserId(user)

        setToogleBotton({class: '#e61919', name: 'Excluir'})  
    }

    const update = (user) => {
        setName(user.name)
        setEmail(user.email)
        setUserId(user)
        setToogleBotton({class: 'green', name: 'Update'})  
    }

    const confirmOrCancelDelete = (name) =>{
        if(name === 'Excluir'){
            handleDelete(userId.id);
        }else if(name === 'Cancelar'){
            setInputs()
            setToogleBotton({class: '#005eff', name:'Salvar'})
        }else if(name === 'Update'){
            setToogleBotton({class: '#005eff', name:'Salvar'})
        }
    }

    const selectAdmin =()=>{
        admin === false ? setAdmin(true) : setAdmin(false);
    }

    const setInputs =()=>{
        setName('')
        setEmail('')
        setUserId('')
        setPassword('')
        setComfirmPassword('')
    }

    const renderTbodyScroll =()=>{   
      return users.map((user, index)=>(
          <tr key={index} >
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{`${user.admin === true ? 'sim' : 'Não'}`}</td>
              <td>
                  <div className='tbody-button-box'>
                  <div className='tbody-button-icon' style={{backgroundColor:'#cccc00'}}>
                    <FaPencilAlt size={10} color='#000'  onClick={() => update(user)}/>
                  </div>

                  <div className='tbody-button-icon' style={{backgroundColor:'#e61919'}}>
                    <FaTrash size={10} color='#fff'  onClick={() => deleteUser(user)}/>
                  </div>
                  </div>
              </td>              
          </tr>
      ))  
    }

    useEffect(() => {
        updateListUsers()
     },[])

        
    return(
        <div className='user-container'>    
            <form className='use-form' onSubmit={toogleButton.name !== 'Excluir' ? handleRegister : handleNoRegister }>
                    <fieldset>
                        <div className='fieldset-box'>
                            <div className='fieldset-input-box'>
                                <label htmlFor='user-name'>Nome:</label>
                                <input type='text' 
                                       id='user-name' 
                                       placeholder='Informe o Nome do usuário'
                                       value={name}
                                       onChange={e => setName(e.target.value)}/>
                            </div>

                            <div className='fieldset-input-box'>
                                <label htmlFor='user-email'>E-mail:</label>
                                <input type='text' 
                                       id='user-email' 
                                       placeholder='Informe o E-mail do usuário'
                                       value={email}
                                       onChange={e => setEmail(e.target.value)}/>
                            </div>
                        </div>
                    </fieldset> 

                    <fieldset>
                        <label>
                            <input type='checkbox' 
                                   name={'admin'}
                                   onClick={selectAdmin}/>
                            Administrador?
                        </label>
                    </fieldset>

                    <fieldset>
                        <div className='fieldset-box'>
                            <div className='fieldset-input-box'>
                                <label htmlFor='user-password'>Senha:</label>
                                <input type='password' 
                                       id='user-password' 
                                       placeholder='Informe a Senha do Usuário'
                                       value={password}
                                       onChange={e => setPassword(e.target.value)}/>
                            </div>

                            <div className='fieldset-input-box'>
                                <label htmlFor='user-confirm-password'>Confirmar Senha:</label>
                                <input type='password' 
                                       id='user-confirm-password' 
                                       placeholder='Confirme a Senha do usuário'
                                       value={comfirmPassword}
                                       onChange={e => setComfirmPassword(e.target.value)}/>
                            </div>  
                        </div>                     
                    </fieldset>   
                    <div className='button-box'>
                        <input  className="button-form" 
                                style={{background: `${toogleButton.class}`}} 
                                type='submit' 
                                value={toogleButton.name}
                                onClick={e => confirmOrCancelDelete(e.target.value)}/>

                        <input  className="button-form" 
                                type="reset"
                                style={{background: '#3f3f3f'}} 
                                value="Cancelar"
                                onClick={e => confirmOrCancelDelete(e.target.value)}/>
                    </div>                        
            </form>
            
            <div className='table-container'>
                <div className='theade'>              
                        <div className='theade-th'>Código</div>
                        <div className='theade-th'>Nome</div>
                        <div className='theade-th'>E-mail</div>
                        <div className='theade-th'>Administrador</div>
                        <div className='theade-th'>Ações</div>                     
                    </div>
                <div className='scroll-table'>

                    <table className='user-table'>
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