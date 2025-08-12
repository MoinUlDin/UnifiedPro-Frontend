import React, { useEffect, useState } from 'react';
import { User, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SelectEmployee from './structuePopup Components/SelectEmployee';
import ConfigrationComponent from './structuePopup Components/ConfigrationComponent';
import ReviewConfirm from './structuePopup Components/ReviewConfirm';
import SalaryServices from '../../../../services/SalaryServices';
import { useDispatch } from 'react-redux';
import { Toast } from 'react-toastify/dist/components';
import toast, { Toaster } from 'react-hot-toast';

interface configType {
    selectedComponents: [
        {
            id: 2;
            name: 'Basic Salary';
            category: 'Basic';
            amount: 25000;
        },
        {
            id: 3;
            name: 'House Rent Allowance';
            category: 'allowance';
            amount: 15000;
        }
    ];
    amounts: {
        '2': 25000;
        '3': 15000;
        '5': 2000;
        '7': 2343;
        '8': 2342;
    };
    payGrade: null | string;
    payFreq: null | string;
    deductions: [];
    baseSalary: 25000;
    estimatedTotal: 40000;
    currency: string;
}
interface Props {
    onClose: () => void;
    initialData?: any;
    response?: (data: any) => void;
}
export default function SalaryStrucrePopup({ onClose = () => {}, initialData = null, response }: Props) {
    const [step, setStep] = useState(1); // 1..3
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [configData, setConfigData] = useState<configType>();
    const despatch = useDispatch();

    function next() {
        if (step < 3) setStep((s) => s + 1);
    }
    function prev() {
        if (step > 1) setStep((s) => s - 1);
    }

    useEffect(() => {
        SalaryServices.FetchAllStructures(despatch).catch((e) => {
            console.log(e);
        });
    }, []);

    const handleNextClick = () => {
        console.log('length : ', configData?.selectedComponents?.length!);
        console.log('paygrade : ', !configData?.payGrade);
        console.log('payfrequency : ', !configData?.payFreq);
        if (step === 1 && !selectedEmployee) return toast.error('Please select an employee first.', { duration: 2000 });
        if (step === 2) {
            if (configData?.selectedComponents?.length! < 1) {
                toast.error('Please select at least 1 component', { duration: 3000 });
                return;
            } else if (!configData?.payGrade) {
                toast.error('Please select Pay Grade', { duration: 3000 });
                return;
            } else if (!configData?.payFreq) {
                toast.error('Please select Pay Frequency', { duration: 3000 });
                return;
            }
        }
        if (step === 3) {
            toast.error('Please Confirm to save', { duration: 3000 });
            return;
        }

        next();
    };

    const onUpdate = (data: any) => {
        console.log('We have data: ', data);
        setConfigData(data);
        SalaryServices.AddSalaryStructure(data)
            .then((r) => {
                console.log('created: ', r);
                onClose();
            })

            .catch((e) => {
                console.log('error Creating salary stucture', e);
            });
    };
    return (
        <div style={{ zIndex: '10000' }} className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-5xl mx-4 h-[550px] overflow-y-scroll ">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* HEADER (persistent) */}
                    <div className="px-6 pt-6 pb-4 border-b">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="flex items-center gap-3 text-xl font-semibold">
                                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white">$</span>
                                    Create Salary Structure
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Design comprehensive compensation package</p>
                            </div>

                            <button aria-label="Close" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Steps + progress */}
                        <div className="mt-6">
                            <div className="flex items-center gap-6">
                                <StepPill number={1} label="Employee" active={step === 1} done={step > 1} />
                                <div className={`flex-1 rounded-xl h-[2px] ${step > 2 ? 'bg-gradient-to-r from-blue-500 to-sky-800 h-[4px]' : 'bg-slate-200'} `} />
                                <StepPill number={2} label="Configure" active={step === 2} done={step > 2} />
                                <div className={`flex-1 rounded-xl h-[2px] ${step === 3 ? 'bg-gradient-to-r from-blue-500 to-sky-800 h-[4px]' : 'bg-slate-200'} `} />
                                <StepPill number={3} label="Review" active={step === 3} done={step > 3} />
                            </div>

                            {/* decorative progress bar */}
                            <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-700 via-pink-500 to-pink-300" style={{ width: `${((step - 1) / 2) * 100 + 33}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* BODY (changes per step) */}
                    <div className="p-6 bg-white max-h-[360px] overflow-y-auto">
                        {step === 1 && <SelectEmployee selectedEmployee={selectedEmployee} onSelect={(e) => setSelectedEmployee(e)} />}

                        {step === 2 && <ConfigrationComponent onUpdate={onUpdate} selectedEmployee={selectedEmployee} />}
                        {step === 3 && <ReviewConfirm onConfirm={onUpdate} config={configData!} selectedEmployee={selectedEmployee} />}
                    </div>

                    {/* FOOTER (persistent) */}
                    <div className="px-6 py-4 border-t bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={prev}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
                                    step === 1 ? 'text-slate-400 border-slate-100 cursor-not-allowed' : 'text-slate-700 border-slate-200 hover:shadow-sm'
                                }`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>

                            <button onClick={onClose} className="px-3 py-2 rounded-md text-slate-700 border border-slate-200 hover:bg-slate-50">
                                Cancel
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-500">Step {step} of 3</div>
                            <button
                                onClick={handleNextClick}
                                disabled={step === 3}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow"
                            >
                                <span>Next</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster reverseOrder={false} position="bottom-right" />
        </div>
    );
}

function StepPill({ number, label, active, done }: { number: any; label: any; active: boolean; done: any }) {
    return (
        <div className="flex items-center gap-3">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    done ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : active ? 'bg-white ring-2 ring-indigo-500 text-indigo-700' : 'bg-slate-100 text-slate-600'
                }`}
            >
                {done ? <CheckCircle size={18} className="text-white" /> : number}
            </div>
            <div className="text-sm">
                <div
                    className={`font-semibold ${active ? 'text-slate-900' : 'text-slate-500'}
        `}
                >
                    {label}
                </div>
            </div>
        </div>
    );
}
