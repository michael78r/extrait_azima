import React, { useState, createContext } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState('');
    const [token, setToken] = useState('');
    return (
      <AuthContext.Provider value={{ username, password, roles, token }}>
        {children}
      </AuthContext.Provider>
    );
  };