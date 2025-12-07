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

// src/App.tsx (TẠM THỜI DÙNG ĐỂ KIỂM TRA PROMOTION SCREEN)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import màn hình PromotionManagerScreen
// Đảm bảo đường dẫn này đúng với nơi bạn vừa tạo file
import PromotionManagerScreen from './features/promotion/screens/PromotionManagerScreen';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Dấu * giúp bắt mọi đường dẫn và hiển thị màn hình Khuyến Mãi */}
        <Route path="*" element={<PromotionManagerScreen />} />
      </Routes>
    </Router>
  );
};

export default App;