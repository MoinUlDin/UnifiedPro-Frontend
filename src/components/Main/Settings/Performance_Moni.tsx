import Performance_Moni_List from './Performence_Moni_Details/Performance_Monitoring';
import Company_Goals_List from './Performence_Moni_Details/Company_Goals_List';
import Departmental_Goals_List from './Performence_Moni_Details/Departmental_Goals_List';
import Departmental_Session_Goals from './Performence_Moni_Details/Departmental_Session_Goals';
import Key_Results_List from './Performence_Moni_Details/Key_Results_List';
import Departmental_KPIs_List from './Performence_Moni_Details/Departmental_KPIs_List';
import { useEffect, useState } from 'react';
import PerformanceServices from '../../../services/PerformanceServices';

const Performance_Moni = () => {
    const [parentState, setParentState] = useState<number>(1);
    useEffect(() => {
        PerformanceServices.FetchCompanyPerformance().catch((e) => {
            console.log(e);
        });
    }, [parentState]);
    return (
        <div>
            <Performance_Moni_List />
            <Company_Goals_List parentState={parentState} setparentState={setParentState} />
            <Departmental_Goals_List parentState={parentState} setparentState={setParentState} />
            <Departmental_Session_Goals parentState={parentState} setparentState={setParentState} />
            <Key_Results_List parentState={parentState} setparentState={setParentState} />
            <Departmental_KPIs_List parentState={parentState} setparentState={setParentState} />
        </div>
    );
};

export default Performance_Moni;
