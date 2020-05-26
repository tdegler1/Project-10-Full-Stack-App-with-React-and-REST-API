// Forbidden - Displays a message letting the user know that they can't access the requested page (Error 401: Unauthorized & Error 403: Forbidden).

import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="bounds">
    <h1>Forbidden</h1>
    <p>Access denied.</p>
    <Link className="button button-secondary" to="/">Return to List</Link>
  </div>
);
