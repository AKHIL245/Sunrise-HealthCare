import AWSAmplify from 'aws-amplify';
import awsdetails from './aws-exports';
import App from './App';
import react from 'react';
import DOM from 'react-dom';
AWSAmplify.configure(awsdetails);
DOM.render(
  <react.StrictMode>
    <App />
  </react.StrictMode>,
  document.getElementById('root')
);
