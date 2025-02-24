// import { Permission } from '../types/permissions';

// const API_URL = 'http://127.0.0.1:8000/api/get-group-permissions';  // Replace with your actual API URL

// export const fetchPermissions = async (): Promise<Permission[]> => {
//   const response = await fetch(API_URL);

//   if (!response.ok) {
//     throw new Error('Failed to fetch permissions');
//   }

//   const data = await response.json();
//   return data.flatMap((group: { permissions: Permission[] }) => group.permissions);
// };
