import React, { Component } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { Form, FormGroup, Input, Col, Button, Row, InputGroup, InputGroupAddon } from "reactstrap";

export default class Busqueda extends Component {
  render() {
    return (
      <Form onSubmit={this.props.onSubmit}>
        <Row form>
          <Col md={9}>
            <FormGroup>
              <InputGroup>
                
                <Input
                  type="search"
                  name="criterioBusqueda"
                  id="criterioBusqueda"
                  placeholder="Criterio de búsqueda"
                  value={this.props.criterioBusqueda}
                  onChange={this.props.onChange}
                />
                <InputGroupAddon addonType="append"><Button onClick={this.props.onSubmit} color="primary">Buscar</Button></InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={3}>
            <Button onClick={this.props.limpiarTabla}>Limpiar</Button>
            {' '}
            <Button color="success" className="ml-1" onClick={this.props.agregarItem}><FaPlusCircle /> Nuevo</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
