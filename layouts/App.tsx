import React from 'react';
import { Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

const LogIn = loadable(() => import('../pages/LogIn'));
const SignUp = loadable(() => import('../pages/SignUp'));

const App = () => (
  <Routes>
    <Route path="/login" element={<LogIn />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);

export default App;
