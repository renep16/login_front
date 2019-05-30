import React, { Component } from 'react';

import './Bienvenida.css';

export default class Bienvenida extends Component {
  render() {
    return (
      <div className="bienvenida">
        <h2>Bienvenido: {this.props.usuario['nombre']}</h2>
      </div>
    )
  }
}
