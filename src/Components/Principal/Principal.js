//React imports
import React, { Component } from 'react';
import { Route } from "react-router-dom";

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

          <Route path="/" exact render={(props) => <Bienvenida {...props} usuario={usuario} />} />
          <Route path="/usuarios/" component={Usuarios} />
          {/* <Bienvenida path={`${process.env.PUBLIC_URL}/`} usuario={usuario} />
            <Usuarios path={`${process.env.PUBLIC_URL}/usuarios`} /> */}

        </section>
      </div >
    )
  }
}
