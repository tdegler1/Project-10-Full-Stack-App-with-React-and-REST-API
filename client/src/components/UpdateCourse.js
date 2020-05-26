// UpdateCourse - This component provides the "Update Course" screen by rendering a form that allows a user to update one of their existing courses. The component also renders an "Update Course" button that when clicked sends a PUT request to the REST API's /api/courses/:id route. This component also renders a "Cancel" button that returns the user to the "Course Detail" screen.

import React, { Component } from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {
  state = {
    id: null,
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: null,
    firstName: '',
    lastName: '',
    errors: [],
  }

// Get the current course as displayed in Course Details when the component gets mounted.
  async componentDidMount() {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const course = await context.data.getCourse(this.props.match.params.id);
    // if the course exists, check to make sure the user who is signed in (authenticated) is the owner of the course. If not, Access Denied. Else proceed to set the state variables with the current course info.
    if (course){
      if (course.User.id !== authenticatedUser.id) {
        this.props.history.push('/forbidden');
      } else {
          this.setState({
          id: course.id,
          title: course.title,
          description: course.description,
          estimatedTime: course.estimatedTime,
          materialsNeeded: course.materialsNeeded,
          userId: course.User.id,
          firstName: course.User.firstName,
          lastName: course.User.lastName,
        })
        console.log("UpdateCourse.js - Current Course: " + JSON.stringify(this.state));
      }
    } else {
      console.log ("There is no course with that ID.");
      this.props.history.push('/notfound');
    }
  }

  render() {  
    // Using the current course data to populate the form.
    const {firstName, lastName, title, description, estimatedTime, materialsNeeded, errors} = this.state;
    return (
      <div className="bounds course--detail">
          <h1>Update Course</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Update Course"
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
                    <p>By {firstName} {lastName}</p>
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

  // [from UPDATE COURSE button] - submit handler
  submit = () => {
    // we'll need the authenticated user's email address and password (signin credentials) for this to approve.
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const { emailAddress, password } = authenticatedUser;

    // collect the edited values input by the user
    const {id, title, description, estimatedTime, materialsNeeded} = this.state;

    // set the course object with the edited input values
    const updatedCourse = {id, title, description, estimatedTime, materialsNeeded, userId: context.authenticatedUser.id};
    console.log("Updated Course: " + JSON.stringify(updatedCourse));
      
    context.data.updateCourse(updatedCourse, emailAddress, password)
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

  // [from CANCEL button] - sends the user back to the course details screen.
  cancel = () => {
   this.props.history.push(`/courses/${this.state.id}`);
  }
}
