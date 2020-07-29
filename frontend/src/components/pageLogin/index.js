import React, {useState} from 'react'
import './styles.css'
import { FaLock, FaEnvelope, FaKey} from 'react-icons/fa'
import api from '../../services/api'
import {Link , useHistory} from 'react-router-dom';
import Toastify from '../../config/msgToastify'

export default function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory();

    async function handleLogin(e){
        e.preventDefault();
        const data={
            email,
            password
        }

        try{
            const response = await api.post('/signin', data)
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('token',`bearer ${ response.data.token}`);
            localStorage.setItem('admin', response.data.admin);

            history.push('/app/dashbord');
            
        }catch(err){
            Toastify({type:'error', message:`${err.response.data}`})
        }
       
    }



    return(
        <div className='login_container'>
            <div className='login-header'>
                <h1>Login Base de Conhecimento</h1>
            </div>

            <div className='login-form'>
                <div className='left-form'>
                    <div className='login-icon'>
                        <FaLock size={70} color='#fff'/>
                    </div>
                    <h2>Bem-Vindo</h2>
                    <p>Para acessar insira seu email e senha no formulário.</p>
                </div>

                <div className='right-form'>
                    <form onSubmit={handleLogin}>
                    <label htmlFor='loginEmail'>Email</label>
                        <div className='box-form'>
                            <div className='box-form-icon'>
                                <FaEnvelope size={15} color='#333333'/>
                            </div>
                            <div className='box-form-input'>                                
                                <input id='loginEmail' 
                                value={email}
                                onChange={e => setEmail(e.target.value)}/>
                            </div>
                        </div>

                        <label htmlFor='loginPassword'>Senha</label>
                        <div className='box-form'>
                            <div className='box-form-icon'>
                                <FaKey size={15} color='#333333'/>
                            </div>
                            <div className='box-form-input'>                                
                                <input type='password' 
                                id='loginPassword' 
                                value={password}
                                onChange={e => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <Link className='btn-register' to='/register'>Não tem cadastro? Então registre aqui.</Link>

                        <input className='btn-login' type='submit' value='Login'/>
                    </form>
                </div>
            </div>

            <Toastify/>
           
        </div>
    )
}