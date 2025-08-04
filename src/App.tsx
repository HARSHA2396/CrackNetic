import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { EncryptDecrypt } from './pages/Tools/EncryptDecrypt';
import { EncodingPage } from './pages/Tools/EncodingPage';
import { HashPage } from './pages/Tools/HashPage';
import { EnhancedBruteForce } from './pages/Tools/EnhancedBruteForce';
import { AlgorithmPredictionPage } from './pages/Tools/AlgorithmPrediction';
import { EnhancedSteganographyPage } from './pages/Tools/EnhancedSteganographyPage';
import { KeyGeneratorPage } from './pages/Protected/KeyGenerator';
import { AdvancedCrypto } from './pages/Protected/AdvancedCrypto';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public Tools */}
            <Route path="/encrypt" element={<EncryptDecrypt />} />
            <Route path="/encode" element={<EncodingPage />} />
            <Route path="/hash" element={<HashPage />} />
            <Route path="/brute-force" element={<EnhancedBruteForce />} />
            <Route path="/predict" element={<AlgorithmPredictionPage />} />
            <Route path="/steganography" element={<EnhancedSteganographyPage />} />
            
            {/* Protected Tools */}
            <Route 
              path="/key-generator" 
              element={
                <ProtectedRoute>
                  <KeyGeneratorPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advanced-crypto" 
              element={
                <ProtectedRoute>
                  <AdvancedCrypto />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;