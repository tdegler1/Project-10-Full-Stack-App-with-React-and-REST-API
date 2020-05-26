import config from './config';

// Create an HTTP request
// @param {String} path - pathname to add to url
// @param {String} [method='GET'] - HTTP request verb
// @param {Object} [body=null] - body for HTTP headers object
// @param {Boolean} [requiresAuth=false] - determines whether HTTP Authorization header is needed
// @param {Object} [credentials=null] - contains emailAddress and password
// @returns {Function} - fetch request
export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }


// Get the current authenticated user from the database.
  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
    
// Create a new user to be added to the database.
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    } else if (response.status === 409) {
      console.log("Email is already in use");
      return response.json().then(data => {
        return data.errors;
      });
    } else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

    
// Get all courses from the database.
  async getCourses() {
    const response = await this.api('/courses', 'GET');
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 500) {
      return null;
    } else {
      throw new Error();
    }
  }
    
    
// Get individual course from the database.
  async getCourse(courseId) {
    const response = await this.api(`/courses/${courseId}`, 'GET');
      if(response.status === 200){
        return response.json().then((data) => data);
      } else if (response.status === 404) {
          return null;
      } else {
          throw new Error();
      }
  }

    
// Create a new course to be added to the database.
  async createCourse(course, username, password) {
    const response = await this.api('/courses', 'POST', course, true, { username, password });
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
        return response.json().then(data => {
           return data.errors;
        });
    } else {
        throw new Error();
    }
  }
    
    
// Update any details of an individual course.
  async updateCourse(course, username, password) {
    const response = await this.api(`/courses/${course.id}`, 'PUT', course, true, { username, password });
    if (response.status === 204) {
        return [];
    } else if (response.status === 400) {
        return response.json().then(data => {
           return data.errors;
        });
    } else {
        throw new Error();
    }
  }
    
    
// Delete an individual course.
  async deleteCourse(course, username, password) {
    const response = await this.api(`/courses/${course.id}`, 'DELETE', null, true, { username, password });
      if(response.status === 204){
        return [];
      } else if (response.status === 400) {
          return response.json().then(data => {
          return data.errors;
      })
      } else {
          console.log("Course Not Found");
          throw new Error();
      }
  }
    
}   // END class Data
