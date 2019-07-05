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

import configuracion from '../../config/configuracion.json';
import PrompAceptar from '../PrompAceptar.js';

//Origninal State
const originalState = {
  idItem: 0,
  usuario: '',
  clave: '',
  persona: '',
  rol: 1,
  activo: true,
  validUsuario: true,
  validClave: true,
  usuarioExiste: false,
  estadoForm: 1, //estado puede ser 1 agregar, 2 consultar, 3 modificar
  roles: [],
  eliminarModal: false
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

    this.getRoles();
    if (this.props.idItem !== 0) {
      this.setState({ estadoForm: 2, idItem: this.props.idItem });
      //se hace llamada a la API para buscar mas info de ese usuario
      fetch(`${configuracion['api_node']}usuario/${this.props.idItem}`)
        .then(data => data.json())
        .then(data => {
          // console.log(data[0]);
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

  getRoles = () => {
    fetch(`${configuracion['api_node']}rolusuario`)
      .then(data => data.json())
      .then(data => {
        this.setState({ roles: data });
      })
      .catch(error => console.log(error));
  }

  verificarUsuarioNuevo = (e) => {  //verifica si el usuario no esta previamente registrado
    const usuario = e.target.value;
    fetch(`${configuracion['api_node']}existeUsuario/${usuario}`)
      .then(data => {
        if (data.status === 200) {
          this.setState({ usuarioExiste: true });
        } else {
          this.setState({ usuarioExiste: false });
        }
      })
      .catch(error => console.log(error));
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

  // agregar - modificar
  agregarUsuario = () => {
    //post para enviar datos del form
    if (this.state.validClave && this.state.validUsuario && !this.state.usuarioExiste) {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          idusuario: null,
          usuario: this.state.usuario,
          clave: this.state.clave,
          nombre: this.state.persona,
          activo: this.state.activo,
          idrol: this.state.rol
        })
      };
      fetch(`${configuracion['api_node']}usuario`, options)
        .then(data => {
          if (data.ok && data.status === 203) {
            throw data.statusText;
          } else if (!data.ok) {
            throw data.body;
          } else {
            data.json()
              .then(data => {
                // this.setState(originalState);

                const item = data[0];
                this.setState({
                  idItem: item['idusuario'],
                  usuario: item['usuario'],
                  clave: '',
                  persona: item['nombre'],
                  rol: item['idrol'],
                  activo: (item['activo'] === 1) ? true : false,
                  validUsuario: true,
                  validClave: true,
                  estadoForm: 2
                });

                this.props.aceptarForm();
              })
          }
        })
        .catch(error => console.log(error));
    }
  }

  modificarUsuario = () => {
    //post para enviar datos del form
    let objetoUpdate = null;
    if (this.state.clave.length > 0) {
      objetoUpdate = {
        usuario: this.state.usuario,
        clave: this.state.clave,
        nombre: this.state.persona,
        activo: this.state.activo,
        idrol: this.state.rol
      }
    } else {
      objetoUpdate = {
        usuario: this.state.usuario,
        nombre: this.state.persona,
        activo: this.state.activo,
        idrol: this.state.rol
      }
    }
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(objetoUpdate)
    };
    fetch(`${configuracion['api_node']}usuario/${this.state.idItem}`, options)
      .then(data => {
        if (data.ok && data.status === 203) {
          throw data.statusText;
        } else if (!data.ok) {
          throw data.body;
        } else {
          data.json()
            .then(data => {
              // this.setState(originalState);

              const item = data[0];
              this.setState({
                idItem: item['idusuario'],
                usuario: item['usuario'],
                clave: '',
                persona: item['nombre'],
                rol: item['idrol'],
                activo: (item['activo'] === 1) ? true : false,
                validUsuario: true,
                validClave: true,
                estadoForm: 2
              });
              this.props.modificarForm();
            })
        }
      })
      .catch(error => console.log(error));
  }

  eliminarUsuario = () => {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    };
    fetch(`${configuracion['api_node']}usuario/${this.state.idItem}`, options)
      .then(data => {
        if (!data.ok) {
          throw data.body;
        } else {
          this.props.eliminarForm();
        }
      })
      .catch(error => console.log(error));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    switch (this.state.estadoForm) {
      case 1:
        this.agregarUsuario();
        break;
      case 3:
        this.modificarUsuario()
        break;

      default:
        break;
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
        this.setState({ eliminarModal: true });
        break;
      default:
        this.setState({ estadoForm: 2 });
        break;
    }
  }

  toggleEliminarModal = ()=>{
    this.setState({ eliminarModal: !this.state.eliminarModal });
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
    const rolOpciones = this.state.roles.map(item => <option key={'rol-' + item.idrol} value={item.idrol}>{item.nombre}</option>)

    return (
      <>
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
                    onBlur={this.verificarUsuarioNuevo}
                    required
                    minLength="5"
                    maxLength="15"
                    valid={(this.state.validUsuario && (this.state.usuario !== '') && !this.state.usuarioExiste)}
                    invalid={!this.state.validUsuario || this.state.usuarioExiste}
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
                    {rolOpciones}
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
      <PrompAceptar
        muestraPromp={this.state.eliminarModal}
        togglePromp={this.toggleEliminarModal}
        titulo="Eliminar"
        pregunta="¿Seguro que desea eliminar al usuario"
        aceptarPromp={this.eliminarUsuario}
       />
      </>
    );
  }
}

export default FormularioModal;