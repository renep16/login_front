//React imports
import React, { Component } from 'react';
import { Router } from "@reach/router";

//My components
import Menu from '../Menu/Menu';
import Bienvenida from '../Bienvenida/Bienvenida';
import Usuarios from '../Usuarios/Usuarios';

// styles
import './Principal.css';

export default class Principal extends Component {
  
  render() {
    const usuario = this.props.usuario;
    return (
      <div className="principal">
        <Menu
          menu={this.props.menu}
          cerrarSesion={this.props.cerrarSesion}
        />
        <section className="container contenido mt-3">
          <Router basename={'/login'}>
            <Bienvenida path={`${process.env.PUBLIC_URL}/`} usuario={usuario} default  />
            <Usuarios registerUser={this.registerUser} path={`${process.env.PUBLIC_URL}/usuarios`} />
          </Router>
        </section>
      </div >
    )
  }
}
