// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { Permission } from '../types/permissions';
// import { fetchPermissions } from '../utils/api';

// type PermissionsContextType = {
//   permissions: Permission[];
//   loading: boolean;
//   error: string | null;
// };

// // Update the type definition to include children
// interface PermissionsProviderProps {
//   children: ReactNode;
// }

// const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// // Update the component to accept the correct props type
// export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
//   const [permissions, setPermissions] = useState<Permission[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadPermissions = async () => {
//       try {
//         const data = await fetchPermissions();
//         setPermissions(data);
//       } catch (error) {
//         setError('Failed to load permissions');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPermissions();
//   }, []);

//   return (
//     <PermissionsContext.Provider value={{ permissions, loading, error }}>
//       {children}
//     </PermissionsContext.Provider>
//   );
// };

// export const usePermissions = (): PermissionsContextType => {
//   const context = useContext(PermissionsContext);
//   if (!context) {
//     throw new Error('usePermissions must be used within a PermissionsProvider');
//   }
//   return context;
// };