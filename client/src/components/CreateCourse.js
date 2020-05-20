import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  }

  render() {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const {title, description, estimatedTime, materialsNeeded, errors} = this.state;

    return (
      <div className="bounds course--detail">
          <h1>Create Course</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create Course"
            elements={() => (
              <React.Fragment>
                <div className="grid-66">
                  <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <div>
                      <input 
                        id="title" 
                        name="title" 
                        type="text"
                        value={title} 
                        onChange={this.change} 
                        placeholder="Course title..."
                        className="input-title course--title--input" />
                    </div>
                    <p>By {authenticatedUser.firstName} {authenticatedUser.lastName}</p>
                  </div>
                  <div className="course--description">
                    <div>
                      <textarea 
                        id="description" 
                        name="description" 
                        value={description} 
                        onChange={this.change} 
                        placeholder="Course description..." />
                    </div>
                  </div>
                </div>
        
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <div> 
                          <input 
                            id="estimatedTime" 
                            name="estimatedTime" 
                            type="text"
                            value={estimatedTime} 
                            onChange={this.change} 
                            placeholder="Hours"
                            className="course--time--input" />
                        </div>    
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <div>
                          <textarea 
                            id="materialsNeeded" 
                            name="materialsNeeded"
                            type="text"
                            value={materialsNeeded} 
                            onChange={this.change} 
                            placeholder="List materials..." />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </React.Fragment>
            )} />   
      </div>    
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    // we'll need the authenticated user's email address and password (signin credentials) for this to approve.
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const { emailAddress, password } = authenticatedUser;
    console.log("CreateCourse emailAddress: " + emailAddress);
    console.log("CreateCourse password: " + password);
    // collect the values input by the user
    const {title, description, estimatedTime, materialsNeeded} = this.state;

    // set the course object with the input values
    const newCourse = {title, description, estimatedTime, materialsNeeded};
    console.log("CreateCourse newCourse: " + JSON.stringify(newCourse));
      
    context.data.createCourse(newCourse, emailAddress, password)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
            this.props.history.push('/');   
            };
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push('/error');
      });
  }

  cancel = () => {
   this.props.history.push('/');
  }
}
