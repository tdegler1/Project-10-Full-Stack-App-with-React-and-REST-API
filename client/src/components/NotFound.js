// NotFound - Display a message letting the user know that the requested page can't be found (Error 404: Not Found).

import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="bounds">
    <h1>Not Found</h1>
    <p>Sorry! We couldn't find the page you're looking for.</p>
    <Link className="button button-secondary" to="/">Return to List</Link>
  </div>
);
