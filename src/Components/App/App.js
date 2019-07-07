import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Login from '../Login/Login';
import Principal from '../Principal/Principal';

import cookie from 'react-cookies';

//config file
import configuracion from '../../config/configuracion.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      opciones: []
    }
  }

  componentWillMount() {
    const userCoockie = cookie.load('usuario');
    if (userCoockie) {
      this.setState({ usuario: userCoockie });
      this.buscarMenu(userCoockie['idrol']);
    }
  }

  buscarMenu = (idrol) => {
    fetch(`${configuracion['api_node']}buscarMenu/${idrol}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then(data => {
        this.setState({ opciones: data });
      })
      .catch(errorMessage => {
        console.log(errorMessage);
      });
  }

  asignarUsuario = (usuario) => {
    if (usuario) {
      this.setState({
        usuario: usuario['datos_usuario']
      },()=>{
        this.buscarMenu(this.state.usuario.idrol);
      });
      
      cookie.save('usuario', usuario['datos_usuario'], { path: '/' })
    }

  }

  cerrarSesion = () => {
    fetch(`${configuracion['api_url']}sesiones/cerrar_sesion.php`)
      .then(data => {
        this.setState({ usuario: null, opciones: null });
        cookie.remove('usuario', { path: '/' })
      })
      .catch(errorMessage => {
        console.log(errorMessage);
      });
  }

  render() {
    return (
      <div>
        {
          (this.state.usuario) ? (
            <Router basename="/login">
              <Principal
                usuario={this.state.usuario}
                menu={this.state.opciones}
                cerrarSesion={this.cerrarSesion}
              />
            </Router>
          ) : (
              <Login asignarUsuario={this.asignarUsuario} />
            )
        }
      </div>
    );
  }
}

export default App;