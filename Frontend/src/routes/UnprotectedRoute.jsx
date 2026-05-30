import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import {Navigate} from "react-router-dom"

const UnprotectedRoute = ({children}) => {
const { loading, isAuthenticated } = useSelector((state) => state.user);
  if(loading === false){
    if (isAuthenticated) {
      return <Navigate to="/Analyze" replace />;
    }
    }
  return children;
}

export default UnprotectedRoute