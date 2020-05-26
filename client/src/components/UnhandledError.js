// UnhandledError - Display a message letting the user know that an unexpected error has occurred (Error 500: Internal Server Error & Error 409: Conflict)

import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="bounds">
    <h1>Unexpected Error</h1>
    <p>Sorry! An unexpected error has occurred.</p>
    <Link className="button button-secondary" to="/">Return to List</Link>
  </div>
);
