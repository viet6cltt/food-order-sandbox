// import React from 'react';
// import { AuthProvider } from './contexts/AuthContext';
// import AppRoutes from './routes/AppRoutes';

// function App() {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerMenuListScreen from './features/owner/screens/OwnerMenuListScreen';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<OwnerMenuListScreen />} />
      </Routes>
    </Router>
  );
};

export default App;