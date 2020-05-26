// CourseDetail - This component provides the "Course Detail" screen by retrieving the detail for a course from the REST API's /api/courses/:id route and rendering the course. The component also renders a "Delete Course" button that when clicked should send a DELETE request to the REST API's /api/courses/:id route in order to delete a course. This component also renders an "Update Course" button for navigating to the "Update Course" screen.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {
  state = {
    course: {},
    owner: {},
  };

// Get the current course when the component gets mounted.
  async componentDidMount() {
    const { context } = this.props;
    const course = await context.data.getCourse(this.props.match.params.id);
      console.log("CourseDetail.js - attempt to fetch course: " + JSON.stringify(course));
    if (course){
      this.setState({ course: course });
      this.setState({ owner: course.User });
    } else {
      console.log ("There is no course with that ID.");
      this.props.history.push('/notfound');
    }
  }

// Delete handler
  deleteCourse = (event) => {
    event.preventDefault();
    // we'll need the authenticated user's email address and password (signin credentials) for this to approve.
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const { emailAddress, password } = authenticatedUser;
    const courseToDelete = this.state.course;
//    console.log("Ready to delete course: " + JSON.stringify(courseToDelete));
    context.data.deleteCourse(courseToDelete, emailAddress, password)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
            this.props.history.push('/');   
            };
      })
      .catch((err) => {
        console.log("Unexpected Error: " + err);
        this.props.history.push('/error');
      });
  }

  render() {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const { course, owner } = this.state;
    const { title, description, estimatedTime, materialsNeeded } = course;
    const { firstName, lastName, emailAddress } = owner;

    // Check if current signed in user (authenticated user) is the owner of the course, then display "Update Course" and "Delete Course" buttons. If "Delete Course" button is clicked, pop up an alert message to confirm (to avoid inadvertent course deletions).
    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {authenticatedUser  && (authenticatedUser.emailAddress === emailAddress) ? 
                <React.Fragment>
                  <span>
                    <Link className="button" to={`/courses/${this.state.course.id}/update`}>Update Course</Link>
                      <Link className="button btn-delete" to="/" onClick={e =>
                        window.confirm("Are you sure you wish to delete this course?") && this.deleteCourse(e)}>Delete Course</Link>
                  </span>
                </React.Fragment>
                : (null)
              }
              <Link className="button button-secondary" to="/">Return to List</Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{title}</h3>
              <p>{firstName} {lastName}</p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    <ReactMarkdown source={materialsNeeded} />
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
