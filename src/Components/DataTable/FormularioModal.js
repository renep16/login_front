import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";

class FormularioModal extends Component {
  render() {
    return (
      <Modal isOpen={this.props.muestraForm} toggle={this.props.toggleForm}>
        <ModalHeader toggle={this.props.toggleForm}>Modal title</ModalHeader>
        <ModalBody>
          {this.props.idItem}
      </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.aceptarForm}>Do Something</Button>{' '}
          <Button color="secondary" onClick={this.props.cancelarForm}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default FormularioModal;