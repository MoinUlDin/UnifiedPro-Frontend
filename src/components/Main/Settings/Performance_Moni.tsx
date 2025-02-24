import Performance_Moni_List from './Performence_Moni_Details/Performance_Moni_List';
import Company_Goals_List from './Performence_Moni_Details/Company_Goals_List';
import Departmental_Goals_List from './Performence_Moni_Details/Departmental_Goals_List';
import Departmental_Session_Goals from './Performence_Moni_Details/Departmental_Session_Goals';
import Key_Results_List from './Performence_Moni_Details/Key_Results_List';
import Departmental_KPIs_List from './Performence_Moni_Details/Departmental_KPIs_List';

const Performance_Moni = () => {
    return (
        <div>
            <Performance_Moni_List />
            <Company_Goals_List />
            <Departmental_Goals_List />
            <Departmental_Session_Goals />
            <Key_Results_List />
            <Departmental_KPIs_List />
        </div>
    );
};

export default Performance_Moni;