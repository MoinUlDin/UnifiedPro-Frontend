import { Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import EvaluationServices from '../../../services/EvaluationServices';

function EmployeeManagerPage() {
    const [tabs, setTabs] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiData, setApiData] = useState(null);

    const fetchassignments = () => {
        setLoading(true);
        EvaluationServices.getEmployeeMangerAssignments()
            .then((r) => {
                console.log('empoyee-manager: ', r);
                setApiData(r);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const fself = () => {
        setLoading(true);
        EvaluationServices.getSelfAssignments()
            .then((r) => {
                console.log('self: ', r);
                setApiData(r);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchassignments();
        fself();
    }, []);
    return (
        <div className="">
            {/* header Text */}
            <h1 className="text-3xl font-bold">Employee → Manager Evaluations</h1>
            <p className="text-gray-500">Anonymous feedback about management effectiveness and leadership</p>
            <div className="border p-4 rounded-lg mt-8 bg-white">
                <div className="flex items-center gap-3">
                    <Lock size={45} />
                    <div>
                        <h3 className="font-bold">Strictly Confidential:</h3>
                        <p className="text-gray-600">
                            Employee→Manager evaluations are completely anonymous. Individual responses cannot be traced back to specific employees. Only company owners and senior management can view
                            aggregated results to ensure leadership development.
                        </p>
                    </div>
                </div>
            </div>
            {/* tabs */}
            <div className="flex items-center justify-center gap-2 p-1 bg-gray-200 rounded-full mt-4">
                <button onClick={() => setTabs(1)} className={`flex-1 py-1 rounded-full ${tabs === 1 && 'bg-white'}`}>
                    My Evaluations
                </button>
                <button onClick={() => setTabs(2)} className={`flex-1 py-1 rounded-full ${tabs === 2 && 'bg-white'}`}>
                    Reports (Restricted)
                </button>
                <button onClick={() => setTabs(3)} className={`flex-1 py-1 rounded-full ${tabs === 3 && 'bg-white'}`}>
                    Leadership Analytics
                </button>
            </div>

            {/* Main Content */}
            <div className="border p-4 rounded-xl mt-3 bg-white">
                {tabs === 1 && (
                    <div>
                        <h3 className="font-bold">Evaluate Your Manager</h3>
                        <p className="text-gray-500">Provide anonymous feedback to help improve management effectiveness</p>
                    </div>
                )}
                {tabs === 2 && (
                    <div>
                        <h3 className="font-bold">Leadership Development Analytics</h3>
                        <p className="text-gray-500">Insights from anonymous employee feedback</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeManagerPage;
