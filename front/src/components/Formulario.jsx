import React, { useContext, useReducer, useEffect, useRef, useState, createContext, Fragment } from 'react';


const HOST_API = "http://localhost:8080/categoria/todo";
const initialState = {
  todo: { list: [], item: {} }
};
const Store = createContext(initialState)

const FormT = () => {
  const formRef = useRef(null);
  const { dispatch, state: { todo } } = useContext(Store);
  const item = todo.item;
  const [state, setState] = useState(item);

  const onAdd = (event) => {
    event.preventDefault();

    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      categoria:{id:34,nombre:"El nombre"},
    };

    fetch(HOST_API+"/" , {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "",id:"", categoria:"" });
        formRef.current.reset();
      });
  }
  const onEdit = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      categoria:{id:34,nombre:"El nombre"},
    };

    fetch(HOST_API+"/" , {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "",id:"", categoria:"" });
        formRef.current.reset();
      });
  }

  return <form ref={formRef} className="form-control">

    <input
      type="text"
      name="name"
      placeholder="¿Qué piensas hacer hoy?"
      defaultValue={item.name}
      onChange={(event) => {
        setState({ ...state, name: event.target.value })
      }}  ></input>
    {item.id && <button onClick={onEdit} className="btn btn-primary">Actualizar</button>}
    {!item.id && <button onClick={onAdd} className="btn btn-success">Crear</button>}
    <List />
  </form>

} 

const List = () => {
  const { dispatch, state: { todo } } = useContext(Store);
  const currentList = todo.list;
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
 
  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo })
  };

  const onChange = (event, todo) => {
    const request = {
      name: todo.name,
      id: todo.id,
      completed:!todo.completed,
      categoria:{id:34,nombre:"El nombre"},
    };
    fetch(HOST_API, {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        console.log(request);
        dispatch({ type: "update-item", item: todo });
      });
  };

  const decorationDone = {
    textDecoration: 'line-through'
  };
  return <Fragment >
    <table >
      <thead>
        <tr>
          <td>ID</td>
          <td>Tarea</td>
          <td>Completada</td>
        </tr>
      </thead>
      <tbody>
        {currentList.map((todo) => {
          var styles = {color: "purple", fontSize: 15, border:"2px solid purple"}

          return <tr key={todo.id} style={styles}>
            
            <td key={todo.id}>{todo.id}</td>
            <td><input type="checkbox" defaultChecked={todo.completed} onChange={(event) => onChange(event, todo)}></input></td>
            <td onClick={()=> console.log("Hiciste click "+todo.name)}>{todo.name}</td>
            <td><button onClick={() => onDelete(todo.id)} className="btn btn-warning mx-3">Eliminar</button></td>
            <td><button onClick={() => {
              return onEdit(todo)}} className="btn btn-primary">Editar</button></td>
          </tr>
        })}
      </tbody>
    </table>
  </Fragment>
}

function reducer(state, action) {
  switch (action.type) {
    case 'update-item':
      const todoUpItem = state.todo;
      const listUpdateEdit = todoUpItem.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      todoUpItem.list = listUpdateEdit;
      todoUpItem.item = {};
      return { ...state, todo: todoUpItem }
    case 'delete-item':
      const todoUpDelete = state.todo;
      const listUpdate = todoUpDelete.list.filter((item) => {
        return item.id !== action.id;
      });
      todoUpDelete.list = listUpdate;
      return { ...state, todo: todoUpDelete }
    case 'update-list':
      const todoUpList = state.todo;
      todoUpList.list = action.list;
      return { ...state, todo: todoUpList }
    case 'edit-item':
      const todoUpEdit = state.todo;
      todoUpEdit.item = action.item;
      return { ...state, todo: todoUpEdit }
    case 'add-item':
      const todoUp = state.todo.list;
      todoUp.push(action.item);
      
      return { ...state, todo: {list: todoUp, item: {}} }
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

const Formulario=()=>{
  return(<StoreProvider>
    <FormT />
   
  </StoreProvider>);
}

export default Formulario;
