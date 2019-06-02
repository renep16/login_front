import React, { Component } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  FormGroup,
  Label,
  Input,
  Col,
  Form,
  Row,
  FormFeedback,
  FormText
} from "reactstrap";

//Origninal State
const originalState = {
  usuario: '',
  clave: '',
  persona: '',
  rol: 1,
  activo: true,
  validUsuario: true,
  validClave: true,
  usuarioExiste: false,
  estadoForm: 1 //estado puede ser 1 agregar, 2 consultar, 3 modificar
}

const validacionUsuario = /^[0-9a-zA-Z]+$/;
const validacionClave = /^[0-9a-zA-Z]+$/;

class FormularioModal extends Component {
  constructor(props) {
    super(props);

    this.state = originalState;
  }

  componentDidMount() {
    this.setState(originalState);
    const idItem = this.props.idItem;
    if (idItem !== 0) {
      this.setState({ estadoForm: 2 });
      fetch('./usuarios.json')
        .then(data => data.json())
        .then(data => {
          const item = data[0];
          this.setState({
            usuario: item['usuario'],
            clave: '',
            persona: item['nombre'],
            rol: item['idrol'],
            activo: (item['activo'] === 1) ? true : false,
            validUsuario: true,
            validClave: true
          });
        })
        .catch(error => console.log(error));
    }

  }

  handleChange = (e) => {
    const name = e.target.name;
    switch (name) {
      case 'activo':
        this.setState(prevState => ({
          activo: !prevState.activo
        }));
        break;
      case 'usuario': {
        //validaUsuario
        if (e.target.value.length > 4 && e.target.value.length < 16) {
          this.setState({ validUsuario: validacionUsuario.test(e.target.value) });
        } else {
          this.setState({ validUsuario: false });
        }

        this.setState({ [e.target.name]: e.target.value });
        break;
      }
      case 'clave': {
        //valida clave
        if (e.target.value.length > 4 && e.target.value.length < 16) {
          this.setState({ validClave: validacionClave.test(e.target.value) });
        } else {
          this.setState({ validClave: false });
        }
        this.setState({ [e.target.name]: e.target.value });
        break;
      }

      default:
        this.setState({ [e.target.name]: e.target.value });
        break;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.validClave && this.state.validUsuario) {
      this.setState(originalState);
      this.props.aceptarForm();
    }

  }

  modificarForm = () => {
    this.setState({ estadoForm: 3 });
  }

  eliminarForm = () => {
    switch (this.state.estadoForm) {
      case 1:
        this.props.cancelarForm();
        break;
      case 2:
        this.props.eliminarForm();
        break;
      default:
        this.setState({ estadoForm: 2 });
        break;
    }
  }

  render() {
    let titulo = this.props.itemForm + ' - ';
    switch (this.state.estadoForm) {
      case 1:
        titulo += 'Agregar';
        break;
      case 2:
        titulo += 'Consultar';
        break;
      case 3:
        titulo += 'Modificar';
        break;
      default:
        titulo += 'Agregar';
        break;
    }
    return (
      <Modal isOpen={this.props.muestraForm} toggle={this.props.toggleForm} size="lg" centered backdrop="static">
        <Form onSubmit={this.handleSubmit}>
          <ModalHeader toggle={this.props.toggleForm}>{titulo}</ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={5}>
                <FormGroup>
                  <Label for="usuarioForm">Usuario</Label>
                  <Input
                    type="text"
                    name="usuario"
                    id="usuarioForm"
                    placeholder="Ingrese nombre de usuario"
                    value={this.state.usuario}
                    onChange={this.handleChange}
                    required
                    minLength="5"
                    maxLength="15"
                    valid={(this.state.validUsuario && (this.state.usuario !== ''))}
                    invalid={!this.state.validUsuario}
                    disabled={(this.state.estadoForm !== 1)}
                  />
                  <FormFeedback className={(this.state.usuarioExiste) ? 'hide' : ''}>Formato inválido</FormFeedback>
                  <FormFeedback className={(!this.state.usuarioExiste) ? 'hide' : ''} >El usuario ya existe</FormFeedback>
                  <FormText>Debe tener entre 5 y 15 caracteres (no especiales) y/o números.</FormText>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="claveForm">Clave</Label>
                  <Input
                    type="password"
                    name="clave"
                    id="claveForm"
                    placeholder="Ingrese clave"
                    value={this.state.clave}
                    onChange={this.handleChange}
                    required={this.state.estadoForm === 1}
                    minLength="5"
                    maxLength="15"
                    valid={this.state.validClave && (this.state.clave !== '')}
                    invalid={!this.state.validClave}
                    disabled={(this.state.estadoForm === 2)}
                  />
                  <FormFeedback >Formato inválido</FormFeedback>
                  <FormText>Debe tener entre 5 y 15 caracteres (no especiales) y/o números.</FormText>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup check>
                  <Label ></Label>
                  <Input
                    type="checkbox"
                    name="activo"
                    id="activoForm"
                    value="1"
                    checked={this.state.activo}
                    onChange={this.handleChange}
                    required
                    disabled={(this.state.estadoForm === 2)}
                  />
                  <Label for="activoForm" check>Activo</Label>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="personaForm">Persona</Label>
                  <Input
                    type="text"
                    name="persona"
                    id="personaForm"
                    placeholder="Nombre completo"
                    value={this.state.persona}
                    onChange={this.handleChange}
                    required
                    disabled={(this.state.estadoForm === 2)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="rolForm">Rol</Label>
                  <Input
                    type="select"
                    name="rol"
                    id="rolForm"
                    value={this.state.rol}
                    onChange={this.handleChange}
                    required
                    disabled={(this.state.estadoForm === 2)}
                  >
                    <option value="1">Administrador</option>
                    <option value="2">Vendedor</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={this.modificarForm}
              disabled={(this.state.estadoForm !== 2)}>
              Modificar
          </Button>{' '}
            <Button
              color="danger"
              onClick={this.eliminarForm}>
              {(this.state.estadoForm !== 2) ? 'Cancelar' : 'Eliminar'}
            </Button>{' '}
            <Button
              color="success"
              disabled={(this.state.estadoForm === 2)}>
              Aceptar
          </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default FormularioModal;