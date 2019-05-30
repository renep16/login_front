import React, { Component } from 'react';

import './Usuarios.css';
import Busqueda from '../DataTable/Busqueda';
import Tabla from '../DataTable/Tabla';
import FormularioModal from '../DataTable/FormularioModal';

/**
 * Componente que renderiza la pantalla de Usuario
 * Estado:
 *  listaUsuarios: la lista de usuarios json tomada de la API
 *  criterioBusqueda: Es el texto que esta en el form de búsqueda
 *  columnas: Array con la configuración de columnas de la tabla
 *  muestraForm: Muestra el formulario de agregar/modificar/eliminar
 */

export default class Usuarios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaUsuarios: [],
      criterioBusqueda: '',
      columnas: [
        '#', 'Usuario', 'Nombre', 'Activo', 'Rol'
      ],
      muestraForm: false,
      idUsuarioForm: 0
    };
  }

  getUsuarios = () => { //Obtiene todos los usuarios
    fetch('./usuarios.json')
      .then(data => data.json())
      .then(data => {
        this.setState({ listaUsuarios: data });
      })
      .catch(error => console.log(error));;
  }

  getTodos = () => { //si pulsas el boton todos
    this.setState({ criterioBusqueda: '*' });
    this.getUsuarios();
  }

  limpiarTabla = () => { //si pulsas el boton limpiar
    this.setState({
      listaUsuarios: [],
      criterioBusqueda: ''
    });
  }

  agregarItem = () => { //llamada a componente de agregar
    this.setState({ idUsuarioForm: 0 });
    this.toggleForm();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.criterioBusqueda.length > 0) {
      if (this.state.criterioBusqueda === '*')
        this.getUsuarios();
    } else {
      this.setState({ listaUsuarios: [] });
    }
  }

  handleItemClick = (e) => {
    this.setState({ 
      idUsuarioForm: e,
      muestraForm: true
     });
  }

  toggleForm = () => {
    this.setState(prevState => ({
      muestraForm: !prevState.muestraForm
    }));
  }

  render() {
    return (
      <div className="usuarios text-left">
        <div className="bg-white tabla p-4 text-dark">
          <h1>Usuarios</h1>
          <div className="mt-2">
            <Busqueda
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              criterioBusqueda={this.state.criterioBusqueda}
              getTodos={this.getTodos}
              agregarItem={this.agregarItem}
              limpiarTabla={this.limpiarTabla}
            />
          </div>
          <Tabla
            data={this.state.listaUsuarios}
            columnas={this.state.columnas}
            onItemClick={this.handleItemClick}
          />
        </div>
        <FormularioModal
          muestraForm={this.state.muestraForm}
          toggleForm={this.toggleForm}
          idItem={this.state.idUsuarioForm}
          aceptarForm={this.toggleForm}
          cancelarForm={this.toggleForm}
        />



      </div>
    )
  }
}
