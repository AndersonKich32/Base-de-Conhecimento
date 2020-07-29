import React, { useState, useEffect } from 'react'
import './styles.css'
import api from '../../../services/api'
import { FaUndo } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { Treebeard } from 'react-treebeard'

export default function Menu (props){
    const token = localStorage.getItem('token')
    const [data, setData] = useState({})
    const [cursor, setCursor] = useState(false)
    const history = useHistory()

    const updateListCategories = () => {
      api.get('/categories/tree',{
          headers: {
              Authorization: token,
          }
      })
      .then(response => {         
          let tt  = {name:'Conhecimento',children:[...response.data]}
          setData(tt)
      });
      
  }
    
    const treeStyle = {
    tree: {
        base: {
        listStyle: 'none',
        backgroundColor: 'transparent',
        marginTop: 10,
        padding: 0,
        fontFamily: '"Helvetica Neue", "Open Sans", Arial, sans-serif',
        fontSize: '12px'
        },
        node: {
        base: {
            position: 'relative'
        },
        link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block',
        },
        activeLink: {
        background: 'rgba(0, 0, 0, 0.2)',
        width:150+'%',
        },
        toggle: {
        base: {
            position: 'relative',
            display: 'inline-block',
            verticalAlign: 'top',
            marginLeft: '-5px',
            height: '24px',
            width: '24px'
        },
        wrapper: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            margin: '-7px 0 0 -7px',
            height: '14px'
        },
        height: 14,
        width: 14,
        arrow: {
            fill: '#E2C089',
            strokeWidth: 0
        }
        },
        header: {
        base: {
            display: 'inline-block',
            verticalAlign: 'top',
            color: '#fefefe',
        },
        connector: {
            width: '2px',
            height: '12px',
            borderLeft: 'solid 2px black',
            borderBottom: 'solid 2px black',
            position: 'absolute',
            top: '0px',
            left: '-21px'
        },
        title: {
            lineHeight: '24px',
            verticalAlign: 'middle'
        }
        },
        subtree: {
        listStyle: 'none',
        paddingLeft: '19px'
        },
        loading: {
        color: '#E2C089'
        }
        }
    }
  }
    
  const onToggle = (node, toggled) => {
    if (cursor) {
        cursor.active = false;
    }
    node.active = true;
    if (node.children) {
        node.toggled = toggled;
        history.push('/app/dashbord')
        history.push(`/app/categories/${node.id}/articles`);
            }
    setCursor(node);
    setData(Object.assign({}, data))
    }

    useEffect(()=>{
        updateListCategories()
    },[])

        
    return(
        <div className= {`menu-container ${props.hideMenu}`} >  
           <div className='btn-list' onClick={updateListCategories}>
               <div className='btn-refresh'>
                  <FaUndo size={18}/>
               </div>
                
            </div>

        <Treebeard
            style={treeStyle}
            data={data}
            onToggle={onToggle} 
        />
            
        </div>

        
    )
}

