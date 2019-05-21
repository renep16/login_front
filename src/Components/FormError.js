import React, { Component } from 'react';
import { Alert } from 'reactstrap';

class FormError extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errorText: null,
      errorList: []
    }

    this.set_error_text = this.set_error_text.bind(this);
  }

  componentDidMount() {
    fetch('./errores.json')
      .then(response => response.json())
      .then(result => {
        this.setState({
          errorList: result
        });
        this.set_error_text();
      }
      ).catch(error => console.log(error));
    //Ya tengo la lista de errores
    //Ahora buscamos el codigo en el array y lo asignamos a errorText
    
  }

  set_error_text(){
    let list = this.state.errorList;
    const nueva = list.filter(item =>{
      return(
        item['code'] === this.props.errorCode
      )
    })
    this.setState({ errorText: nueva[0]['text'] });
  }


  render() {
    return (
      <Alert color="danger" className="mt-3 rounded-pill text-center">
        {(this.state.errorText)? this.state.errorText : '...'}
      </Alert>
    );
  }
}

export default FormError;