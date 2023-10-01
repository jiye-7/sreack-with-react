import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './layouts/App';

// App 컴포넌트를 id가 app인 div태그 안에다가 실제로 렌더링 하겠다.
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
