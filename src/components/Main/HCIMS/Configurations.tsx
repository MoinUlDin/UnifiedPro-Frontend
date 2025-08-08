import Create_Depart from '../Settings/Create_Depart';
import Create_Design from '../Settings/Designation';
import Edit_Employee from './Edit_Employee';

const Configurations = () => {
    return (
        <div>
            {/* <Create_Depart /> */}
            <Create_Design />
            <Edit_Employee />
        </div>
    );
};

export default Configurations;
