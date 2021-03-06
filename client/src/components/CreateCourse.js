// CreateCourse - This component provides the "Create Course" screen by rendering a form that allows a user to create a new course. The component also renders a "Create Course" button that when clicked sends a POST request to the REST API's /api/courses route. This component also renders a "Cancel" button that returns the user to the default route (i.e. the list of courses).

import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: null,
    errors: [],
  }

  render() {
    // we'll need to retrieve the authenticated user from context to populate the first name and last name (author) section of course details.
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    // state variables will hold the input values from the form.
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
                        placeholder="Course description..." >
                      </textarea>
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
                            placeholder="List materials..." > 
                          </textarea>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </React.Fragment>
            )} 
          />   
      </div>    
    );
  }

  // Helper method that changes the value of each component's state as the user types into the field.
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  // [from CREATE COURSE button] - submit handler
  submit = () => {
    // we'll need the authenticated user's email address and password (signin credentials) for this to approve.
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const { emailAddress, password } = authenticatedUser;
    // retain this url to be able to return once user has signed in.
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    // collect the values input by the user
    const {title, description, estimatedTime, materialsNeeded} = this.state;

    // set the course object with the input values
    const newCourse = {title, description, estimatedTime, materialsNeeded, userId: context.authenticatedUser.id};
    console.log("CreateCourse newCourse: " + JSON.stringify(newCourse));
      
    context.data.createCourse(newCourse, emailAddress, password)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
            this.props.history.push(from);
            };
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push('/error');
      });
  }

  // [from CANCEL button] - sends the user back to the root (list of courses).
  cancel = () => {
   this.props.history.push('/');
  }
}
