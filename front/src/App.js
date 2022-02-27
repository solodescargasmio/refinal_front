
import React, { useContext, useReducer, useEffect, useRef, useState, createContext, Component, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import Formulario from './components/Formulario';

const HOST_API = "http://localhost:8080/categoria";
const initialState = {
  categoria: { list: [], item: {} }
};
const Store = createContext(initialState)

const Form = () => {
  const formRef = useRef(null);
  const { dispatch, state: { categoria } } = useContext(Store);
  const item = categoria.item;
  const [state, setState] = useState(item);

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      nombre: state.name,
      id: state.id,
    };
    fetch(HOST_API, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((categoria) => {
        dispatch({ type: "add-item", item: categoria });
        setState({ nombre: "" });
        formRef.current.reset();
      });
  }
  const onEdit = (event) => {
    event.preventDefault();

    const request = {
      nombre: state.name,
      id: item.id,
      todo:item.todo
    };

    fetch(HOST_API+"/" , {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((categoria) => {
        dispatch({ type: "update-item", item: categoria });
        setState({ nombre: "",id:"", todo:[] });
        formRef.current.reset();
      });
  }

  return <form ref={formRef} className="form-control">

    <input
      type="text"
      name="name"
      placeholder="Lista de To-do"
      defaultValue={item.name}
      onChange={(event) => {
        setState({ ...state, name: event.target.value })
      }}  ></input>
    {item.id && <button onClick={onEdit} className="btn btn-primary">Actualizar</button>}
    {!item.id && <button onClick={onAdd} className="btn btn-success">Crear</button>}
  </form>

} 

const List = () => {
  const { dispatch, state: { categoria } } = useContext(Store);
  const currentList = categoria.list;

  useEffect(() => {
    fetch(HOST_API)
      .then(response => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list })
      })
  }, [dispatch]);

  const onDelete = (id) => {
    fetch(HOST_API + "/" + id, {
      method: "DELETE"
    }).then((list) => {
      dispatch({ type: "delete-item", id })
    })
  };
 
  const onEdit = (categoria) => {
    dispatch({ type: "edit-item", item: categoria })
  };

  const onChange = (event, categoria) => {
    const request = {
      name: categoria.nombre,
      id: categoria.id,
    };
    fetch(HOST_API, {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((categoria) => {
        dispatch({ type: "update-item", item: categoria });
      });
  };

  const decorationDone = {
    textDecoration: 'line-through'
  };
  var styless = {color: "black", border:"4px solid purple"}
  return <div className="panel panel-default">
    <table className="table">
      <thead>
        <tr>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        
        {currentList.map((categoria) => {
          var styles = {color: "purple", fontSize: 15, border:"2px solid purple"}
          return <div>
          <tr key={categoria.id}  style={styless}>
            <td key={categoria.id}>{categoria.id}</td>
            <td onClick={()=> console.log("Hiciste click "+categoria.nombre)}>{categoria.nombre}</td>
            <td><button className="btn btn-danger mx-3" onClick={() => onDelete(categoria.id)}>Eliminar</button></td>
            <td><button className='btn btn-primary' onClick={() => {
              return onEdit(categoria)}}>Editar</button></td>
              
              
          </tr>
          <Formulario Categoria={categoria.nombre}/>
           </div>
          
        })}
      </tbody>
    </table>
  </div>
}


function reducer(state, action) {
  switch (action.type) {
    case 'update-item':
      const categoriaUpItem = state.categoria;
      const listUpdateEdit = categoriaUpItem.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      categoriaUpItem.list = listUpdateEdit;
      categoriaUpItem.item = {};
      return { ...state, categoria: categoriaUpItem }
    case 'delete-item':
      const categoriaUpDelete = state.categoria;
      const listUpdate = categoriaUpDelete.list.filter((item) => {
        return item.id !== action.id;
      });
      categoriaUpDelete.list = listUpdate;
      return { ...state, categoria: categoriaUpDelete }
    case 'update-list':
      const categoriaUpList = state.categoria;
      categoriaUpList.list = action.list;
      return { ...state, categoria: categoriaUpList }
    case 'edit-item':
      const categoriaUpEdit = state.categoria;
      categoriaUpEdit.item = action.item;
      return { ...state, categoria: categoriaUpEdit }
    case 'add-item':
      const categoriaUp = state.categoria.list;
      categoriaUp.push(action.item);
      return { ...state, categoria: {list: categoriaUp, item: {}} }
    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value={{ state, dispatch }}>
    {children}
  </Store.Provider>

}

const App=()=>{
  return(<StoreProvider>
    <Form />
    <List />
   
  </StoreProvider>);
}

export default App;
