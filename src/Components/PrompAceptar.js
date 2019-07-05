import React, { Component } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button
} from "reactstrap";

class PrompAceptar extends Component {
  render() {
    return (
      <Modal isOpen={this.props.muestraPromp} toggle={this.props.togglePromp} size="md" centered backdrop="static">
        <ModalHeader toggle={this.props.togglePromp}>{this.props.titulo}</ModalHeader>
        <ModalBody>
          {this.props.pregunta}
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={this.props.togglePromp}>Cancelar</Button>{' '}
          <Button
            color="success"
            onClick={this.props.aceptarPromp}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default PrompAceptar;