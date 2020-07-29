import api from '../services/api'


export const isAuthorization=()=>{
    const token = localStorage.getItem('token')

   return !token ? false : true
    
}

export const isAuthAdmin = ()=>{
    const admin = localStorage.getItem('admin')
   
    return admin === 'true' ? true : false 
}