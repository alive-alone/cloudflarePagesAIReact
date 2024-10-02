import React, { lazy } from "react";
// import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

import Home from "../views/home/home";
import CreateImage from '@/views/createImage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home></Home>
  },
  {
    path: '/createImage',
    element: <CreateImage></CreateImage>
  },
  // {
  //   path: '/',
  //   element: <Navigate to="/discover" />
  // },
];

export default routes
