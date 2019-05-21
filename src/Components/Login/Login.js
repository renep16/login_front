import React, { Component } from 'react';
import './Login.css';

import FormError from "../FormError";
import { Spinner } from 'reactstrap';

//config file
import configuracion from '../../config/configuracion.json';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usuario: '',
      clave: '',
      recordar_clave: false,
      errorMessage: null,
      disabled: true,
      cargando:false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ errorMessage: null });
    const target = e.target;
    if (target.name === 'recordar_clave') {
      this.setState({
        recordar_clave: !this.state.recordar_clave
      })
    } else {
      this.setState({
        [target.name]: target.value
      })
    }
    if (this.state.usuario !== '' && this.state.clave !== ''){
      this.setState({ disabled: false });
    }else{
      this.setState({ disabled: true });
    }
  }

  handleSubmit(e) {
    this.setState({ 
      errorMessage: null,
      disabled: true,
      cargando:true
    });
    e.preventDefault();

    // const options = {
    //   method: "POST",
    //   body: JSON.stringify(this.state),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   mode: 'cors'
    // }

    fetch(`${configuracion['api_url']}sesiones/iniciar_sesion.php`,
      { method: 'POST', body: JSON.stringify(this.state) })
      .then(data => {
        const res_code = data.status;
        if (res_code === 200) {
          data.json().then((datos) => {
            this.setState({ errorMessage: null, disabled: false, cargando:false });
            this.props.asignarUsuario(datos);
          });
        } else {
          this.props.asignarUsuario(null);
          this.setState({ errorMessage: res_code, disabled: false, cargando:false });
        }
      })
      .catch(errorMessage => {
        this.props.asignarUsuario(null);
        if (errorMessage !== null) {
          // this.setState({ errorMessage: errorMessage });
          console.log(errorMessage);
        } else {
          this.setState({ errorMessage: null, disabled: false, cargando:false });
        }
      })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <h5 className="card-title text-center">Iniciar sesión</h5>
                <form className="form-signin" onSubmit={this.handleSubmit}>
                  <div className="form-label-group">
                    <input
                      type="text"
                      name="usuario"
                      id="inputUsuario"
                      className="form-control"
                      placeholder="Usuario"
                      required
                      autoFocus
                      value={this.state.usuario}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="inputUsuario">Usuario</label>
                  </div>

                  <div className="form-label-group">
                    <input
                      type="password"
                      name="clave"
                      id="inputClave"
                      className="form-control"
                      placeholder="Clave"
                      required
                      value={this.state.clave}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="inputClave">Clave</label>
                  </div>

                  <div className="custom-control custom-checkbox mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                      name="recordar_clave"
                      value="1"
                      onChange={this.handleChange}
                      checked={this.state.recordar_clave}
                    />
                    <label className="custom-control-label" htmlFor="customCheck1">Recordar clave</label>
                  </div>
                  <button
                    className="btn btn-lg btn-primary btn-block text-uppercase"
                    type="submit"
                    disabled={this.state.disabled}
                  >{
                    this.state.cargando ? (
                      <Spinner color="light" />
                    ) : (
                      'Iniciar sesión'
                    )
                  }</button>
                  {(this.state.errorMessage !== null) ? (
                    <div>
                      <FormError errorCode={this.state.errorMessage} />
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
