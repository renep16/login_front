import React, { Component } from 'react';
import { FiLogOut } from "react-icons/fi";
import { Link } from 'react-router-dom';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.cerrarSesion = this.cerrarSesion.bind(this);
    this.crear_html = this.crear_html.bind(this);
  }

  cerrarSesion(e) {
    e.preventDefault();
    this.props.cerrarSesion();
  }

  crear_html(lista, padre = false) {
    let html = null;
    if (lista === null && lista === undefined) {
      return html;
    }
    html = lista.map(element => {
      if (element['hijos']) {
        const funcion = (element['funcion']) ? element['funcion'] : '#drop';
        let hijos = this.crear_html(element['hijos'][0], true);
        return (
          <li className="nav-item dropdown" key={element['idopcion']}>
            <a className={'nav-link dropdown-toggle' + (element['activo'] ? '' : ' disabled')} href={funcion} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {element['nombre']}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              {hijos}
            </div>
          </li>
        )
      } else {
        if (element['funcion']) {
          const url = "/"+element['funcion'];
          if (!padre) {
            return (
              <li className="nav-item" key={element['idopcion']}>
                <Link className={'nav-link' + (element['activo'] ? '' : ' disabled')} to={url} >{element['nombre']}</Link>
              </li>
            )
          } else {  
            return (
              <Link className={'dropdown-item' + (element['activo'] ? '' : ' disabled')} to={url} key={element['idopcion']}>{element['nombre']}</Link>
            )
          }
        } else {
          return (
            <li className="nav-item" key={element['idopcion']}>
              <span className="navbar-text">
                {element['nombre']}
              </span>
            </li>

          )
        }
      }
    });
    return html;
  }

  render() {
    const menu_list = this.props.menu;
    const menu_html = this.crear_html(menu_list, false);
    return (
      <div >
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to={"/"}>Principal UI</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              {menu_html}

            </ul>

            <a className="nav-link" onClick={this.cerrarSesion} href="logout" title="Cerrar Sesión">Cerrar Sesión  <FiLogOut /></a>

          </div>
        </nav>
      </div>
    )
  }
}
