import React, { createContext, useState } from 'react';
import { Provider } from 'react';
import axios from 'axios';
// Creating a context for multiple states
const MyAppContext = createContext(null);


export const MyAppProvider = ({ children }) => {
    const [JobType, setJobType] = useState([]);
    const [PayGrade, setPayGrade] = useState([]);
    const [state3, setState3] = useState([]);
    const FetchData=async()=>{
      try{
        let JobRes=await axios.get("https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/Job-type/",
                    { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                    console.log(JobRes.data)
                    setJobType(JobRes.data)
        let PayGrades=await axios.get("https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me/routine-tasks/pay-grade/",
                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                    console.log(PayGrades.data);
                    setPayGrade(PayGrades.data);
      }catch{}
    }
    return (
      <MyAppContext.Provider value={{ JobType, setJobType, PayGrade, setPayGrade, state3, setState3 }}>
        {children}
      </MyAppContext.Provider>
    );
  };