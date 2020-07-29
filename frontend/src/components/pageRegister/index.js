import React, {useState, useEffect} from 'react'
import {Link , useHistory} from 'react-router-dom'
import api from '../../services/api'
import Toastify from '../../config/msgToastify'
import './styles.css'

export default function Register(){

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [comfirmPassword, setComfirmPassword] = useState('')
    const [admin, setAdmin] = useState(false)
    const history = useHistory();

    const selectAdmin =()=>{
        admin === false ? setAdmin(true) : setAdmin(false);
    }

    async function handleRegister(e){
        e.preventDefault();

        const data ={
            name,
            email,
            password,
            comfirmPassword,
            admin
        }

        try{
            const response = await api.post('/signup', data)
               
            Toastify({type:'success', message:'Operação Realizada com Sucesso'})
            setInputs()
            history.push('/');
        }catch(err){
            Toastify({type:'error', message:`${err.response.data}`})
        }        
    }

    const setInputs =()=>{
        setName('')
        setEmail('')
        setPassword('')
        setComfirmPassword('')
    }

    useEffect(() => {
       setInputs()
    }, [])

    return(
        <div className='container-register'>
          
           <div className='register-form'>
               <h1>Cadastro</h1>
               <form onSubmit={handleRegister}>
                   <input placeholder='Nome'
                            value={name}
                            onChange={e => setName(e.target.value)}/>

                   <input type='email' 
                            placeholder='Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}/>

                   <input type='password' 
                            placeholder='Senha'
                            value={password}
                            onChange={e => setPassword(e.target.value)}/>

                   <input type='password' 
                            placeholder= 'Comfirme a Senha'
                            value={comfirmPassword}
                            onChange={e => setComfirmPassword(e.target.value)}/>

                    <fieldset >
                        <label>
                            <input type='checkbox' 
                                    name={'admin'}
                                    onClick={selectAdmin}/>
                                Administrador?
                        </label>
                    </fieldset>

                    <input type='submit' value='Registrar'/>
                    <Link id='register' to='/'>Já tem cadastro? Acesse o Login!</Link>
               </form>
               
           </div>
           <Toastify/>
        </div>
    )
}
