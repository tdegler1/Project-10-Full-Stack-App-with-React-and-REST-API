// Courses - This component provides the "Courses" screen by retrieving the list of courses from the REST API's /api/courses route and rendering a list of courses. Each course links to its respective "Course Detail" screen. This component also renders a link to the "Create Course" screen.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Courses extends Component {
  state = {
    courses: []
  }

// Get the list of courses when the component gets mounted
  async componentDidMount() {
    const { context } = this.props;
    const courses = await context.data.getCourses();
    if (courses){
      this.setState({courses});
  //    console.log("Courses: " + {courses})
    } else {
      console.log ("There are no courses to list");
      this.props.history.push('/error');
    }
  }

  render() {
    // Go through the list of courses in the array and create the markup for each one. Each child in the array should have a unique "key" prop to give the elements a stable identity.
    const courseList = this.state.courses.map(course => 
    <div className="grid-33" key={course.id}>
      <Link className="course--module course--link" to={`/courses/${course.id}`}>
        <h4 className="course--label">Course</h4>
        <h3 className="course--title">{course.title}</h3>
      </Link>
    </div>
  );                                        

    return (
      <div className="bounds">
        {courseList}
        <div className="grid-33">
          <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
                New Course
            </h3>
          </Link>
        </div>
      </div>
    );
  }
}
