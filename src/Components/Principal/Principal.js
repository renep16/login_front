import React, { Component } from 'react';
import Menu from '../Menu/Menu';
import './Principal.css';

export default class Principal extends Component {
  render() {
    return (
      <div className="principal">
        <Menu 
          menu={this.props.menu} 
          cerrarSesion={this.props.cerrarSesion}
        />
      </div>
    )
  }
}
