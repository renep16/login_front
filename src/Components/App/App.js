import React, { Component } from 'react';
import Login from '../Login/Login';
import Principal from '../Principal/Principal';

import cookie from 'react-cookies'

//config file
import configuracion from '../../config/configuracion.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      opciones: []
    }

    this.asignarUsuario = this.asignarUsuario.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this);
  }

  componentWillMount() {
    const userCoockie = cookie.load('usuario');
    if (userCoockie) {
      this.setState({ usuario: userCoockie });
      fetch(`${configuracion['api_url']}sesiones/buscar_menu.php`, {
        method: 'POST',
        body: JSON.stringify({
          idrol: userCoockie['idrol']
        })
      })
        .then(data => data.json())
        .then(data => {
          this.setState({ opciones: data });
        })
        .catch(errorMessage => {
          console.log(errorMessage);
        });
    }
  }

  asignarUsuario(usuario) {
    if (usuario) {
      this.setState({
        usuario: usuario['datos_usuario'],
        opciones: usuario['opciones']
      });
      cookie.save('usuario', usuario['datos_usuario'], { path: '/' })
    }

  }

  cerrarSesion() {
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
            <Principal
              usuario={this.state.usuario}
              menu={this.state.opciones}
              cerrarSesion={this.cerrarSesion}
            />
          ) : (
              <Login asignarUsuario={this.asignarUsuario} />
            )
        }
      </div>
    );
  }
}

export default App;