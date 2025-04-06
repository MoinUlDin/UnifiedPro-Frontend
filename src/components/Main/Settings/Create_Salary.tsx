import Deductions from './Salary_Details/Deductions';
import Job_Type from './Salary_Details/Job_Type';
import Leave_Quota from './Salary_Details/Leave_Quota';
import Pay_Frequencies from './Salary_Details/Pay_Frequencies';
import Paygrade from './Salary_Details/Paygrade';
import Salary_Component from './Salary_Details/Salary_Component';
import Salary_Structure from './Salary_Details/Salary_Structure';
import BasicProfile from './Salary_Details/BasicProfile';
const Create_Salary = () => {
    return (
        <div>
            <Job_Type />
            <Paygrade />
            <Salary_Component />
            <Pay_Frequencies />
            <Deductions />
            <BasicProfile />
            <Leave_Quota />
            <Salary_Structure />
        </div>
    );
};

export default Create_Salary;
