// UserSignOut - signs out the authenticated user and redirects the user to the default route (i.e. the list of courses).

import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({context}) => {
  context.actions.signOut();

  return (
    <Redirect to="/" />
  );
}
