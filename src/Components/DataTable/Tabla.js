import React, { Component } from 'react';
import { Table, Button } from "reactstrap";
import {IoMdList} from 'react-icons/io';

/**
 * Muestra una tabla Bootstrap
 * Recibe dos props importantes
 *   columnas: Array con el nombre de las columnas en orden
 *   data: Array de objetos de datos por orden de muestra
 */

export default class Tabla extends Component {
  render() {
    //Se crean los th de la tabla usando las columans
    const columnas = this.props.columnas.map((item) => {
      return (
        <th key={item}>{item}</th>
      )
    });

    //se crean las filas recorriendo los objetos
    const filas = this.props.data.map((item, index1) => {
      let values= Object.values(item);
      const tds = values.map((subItem, index2)=>{
        return(<td key={index1+'-'+index2}>{subItem}</td>);
      });
      return (
        <tr key={values[0]} >
          {tds}
          <td><Button onClick={()=>this.props.onItemClick(values[0])}><IoMdList /></Button></td>
        </tr>
      );
    })

    return (
      <Table striped responsive>
        <thead>
          <tr>
            {columnas}
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filas}
        </tbody>
      </Table>
    )
  }
}
