import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {
  state = {
    course: {},
    owner: {},
  };

  async componentDidMount() {
    const { context } = this.props;
    const course = await context.data.getCourse(this.props.match.params.id);
//    console.log("Course Owner Email Address: " + course.User.emailAddress);
    if (course){
      this.setState({ course });
      this.setState({ owner: course.User });
    } else {
      console.log ("There are no courses to list");
    }
  }

  render() {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const { course, owner } = this.state;
    const { title, description, estimatedTime, materialsNeeded } = course;
    const { firstName, lastName, emailAddress } = owner;

    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {authenticatedUser  && (authenticatedUser.emailAddress === emailAddress) ? 
//                (console.log("Display Delete and Update buttons"));
                <React.Fragment>
                  <span>
                    <Link className="button" to={`/courses/${this.state.course.id}/update`}>Update Course</Link>
                    <Link className="button" to="/" onClick={this.handleDelete}>Delete Course</Link>
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
