import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceNavigation: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const navigate = useNavigate();

    // Define route mappings with variations of commands
    const routeMappings = [
        // Main Routes
        { path: '/', commands: ['home', 'main dashboard', 'go to home', 'navigate home', 'take me home'] },
        { path: '/dashboard', commands: ['dashboard', 'main dashboard', 'open dashboard', 'go to dashboard', 'navigate to dashboard'] },
        { path: '/todolist', commands: ['todo list', 'tasks', 'my tasks', 'show todo list', 'open tasks', 'view my tasks'] },
        { path: '/calendar', commands: ['calendar', 'schedule', 'my calendar', 'open calendar', 'show schedule', 'view calendar'] },
        
        // HCIMS Routes
        { path: '/hcims', commands: ['hcims', 'company dashboard', 'human resource', 'open hcims', 'go to company dashboard'] },
        { path: '/edit_employee', commands: ['edit employee', 'modify employee', 'change employee details', 'update employee info'] },
        { path: '/terminate_employee', commands: ['terminate employee', 'remove employee', 'delete employee', 'end employment'] },
        { path: '/whatsapp', commands: ['whatsapp', 'chat', 'open whatsapp', 'start chat'] },
        { path: '/reports_pages', commands: ['reports', 'hcims reports', 'view reports', 'show hcims reports'] },
        { path: '/config_reports', commands: ['configuration', 'config reports', 'view configurations', 'show config reports'] },
        { path: '/employee-details', commands: ['employee details', 'staff details', 'view employee info', 'show staff details'] },
        { path: '/Employee_Contact_Directory', commands: ['contact directory', 'employee contacts', 'view contact list', 'show employee contacts'] },
        { path: '/Birthday_Directory', commands: ['birthday directory', 'birthdays', 'view birthdays', 'show birthday list'] },
        
        // Tasks Routes
        { path: '/company_tasks_dashboard', commands: ['tasks dashboard', 'company tasks', 'view task dashboard', 'show company tasks'] },
        { path: '/view_tasks', commands: ['view tasks', 'show tasks', 'check tasks', 'see my tasks'] },
        { path: '/tasks_reports', commands: ['task reports', 'tasks report', 'view task reports', 'show tasks report'] },
        { path: '/tasks_form', commands: ['tasks form', 'task form', 'view task form', 'show tasks form'] },
        
        // Routines Routes
        { path: '/routine_report_dashboard', commands: ['routines dashboard', 'routine reports', 'view routines dashboard', 'show routine reports'] },
        { path: '/staff_attendence', commands: ['attendance', 'staff attendance', 'mark attendance', 'check staff attendance'] },
        { path: '/employee_leave_requests', commands: ['leave requests', 'time requests', 'view leave requests', 'show time requests'] },
        { path: '/create_meeting', commands: ['create meeting', 'schedule meeting', 'set up meeting', 'arrange meeting'] },
        { path: '/expense_claims', commands: ['expense claims', 'claim expenses', 'view expense claims', 'show claim expenses'] },
        { path: '/create_expense', commands: ['create expense', 'new expense', 'add expense', 'submit expense'] },
        { path: '/routines_reports', commands: ['routines reports', 'routine reports', 'view routines reports', 'show routine reports'] },
        { path: '/whistle', commands: ['whistle', 'alert', 'trigger whistle', 'activate alert'] },
        
        // Evaluation Routes
        { path: '/company_policies', commands: ['company policies', 'policies', 'view company policies', 'show policies'] },
        { path: '/contest', commands: ['contest', 'competition', 'view contest', 'show competition'] },
        { path: '/performance_matrix', commands: ['performance matrix', 'performance metrics', 'view performance matrix', 'show performance metrics'] },
        { path: '/setup_evaluation', commands: ['setup evaluation', 'evaluation setup', 'start evaluation setup', 'initiate evaluation'] },
        
        // Settings Routes
        { path: '/company_info', commands: ['company info', 'company information', 'view company info', 'show company information'] },
        { path: '/group_company', commands: ['group company', 'company group', 'view group company', 'show company group'] },
        { path: '/create_department', commands: ['create department', 'new department', 'add department', 'establish department'] },
        { path: '/create_designation', commands: ['create designation', 'new designation', 'add designation', 'establish designation'] },
        { path: '/create_salary', commands: ['create salary', 'new salary', 'add salary', 'establish salary'] },
        { path: '/performance_monitoring', commands: ['performance monitoring', 'monitor performance', 'view performance monitoring', 'show monitor performance'] },
        { path: '/permissions', commands: ['permissions', 'access control', 'view permissions', 'show access control'] },
        
        // Training Routes
        { path: '/training_assessment', commands: ['training assessment', 'assess training', 'view training assessment', 'show assess training'] },
        { path: '/create_training', commands: ['create training', 'new training', 'add training', 'establish training'] },
        { path: '/assign_training', commands: ['assign training', 'allocate training', 'distribute training', 'assign new training'] },
        { path: '/create_questions', commands: ['create questions', 'new questions', 'add questions', 'establish questions'] },
        { path: '/view_results', commands: ['view results', 'results', 'check results', 'show results'] },
        { path: '/create_quiz', commands: ['create quiz', 'new quiz', 'add quiz', 'establish quiz'] },
        { path: '/submit_quiz', commands: ['submit quiz', 'quiz submission', 'complete quiz', 'send quiz'] },
    ];

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const handleCommand = (command: string) => {
        setIsProcessing(true);
        console.log('Received command:', command);
        
        // Clean up the command
        command = command.toLowerCase().trim();
        
        // Remove common prefixes
        const prefixes = ['go to', 'open', 'show', 'navigate to', 'take me to', 'i want to', 'please', 'can you', 'could you'];
        for (const prefix of prefixes) {
            if (command.startsWith(prefix)) {
                command = command.substring(prefix.length).trim();
                break;
            }
        }

        // Find matching route
        let bestMatch = null;
        let highestMatchScore = 0;

        for (const route of routeMappings) {
            for (const cmd of route.commands) {
                // Check for exact match
                if (command.includes(cmd)) {
                    bestMatch = route.path;
                    break;
                }

                // Check for partial matches
                const words = cmd.split(' ');
                let matchScore = 0;
                for (const word of words) {
                    if (command.includes(word)) {
                        matchScore++;
                    }
                }
                if (matchScore > highestMatchScore) {
                    highestMatchScore = matchScore;
                    bestMatch = route.path;
                }
            }
            if (bestMatch) break;
        }

        setTimeout(() => {
            setIsProcessing(false);
            if (bestMatch) {
                speak(`Navigating to ${command}`);
                navigate(bestMatch);
            } else {
                speak("I'm sorry, I didn't understand that command. Please try again with a different phrase.");
                console.log("Command not recognized:", command);
            }
        }, 1000);
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setTranscript('');
                speak("How may I assist you today?");
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript.toLowerCase();
                const confidence = event.results[current][0].confidence;
                setConfidence(confidence);
                setTranscript(transcript);
                
                if (event.results[current].isFinal) {
                    handleCommand(transcript);
                }
            };

            recognition.start();
        } else {
            console.error('Speech recognition not supported');
            speak("Speech recognition is not supported in your browser");
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startListening}
                className={`p-4 rounded-full shadow-lg ${
                    isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors duration-200`}
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                    transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                </motion.svg>
            </motion.button>

            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-700"
                        >
                            <div className="relative">
                                {/* Animated Rings */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="absolute w-32 h-32 border-4 border-blue-500/20 rounded-full"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.5, 0.3],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                    <motion.div
                                        className="absolute w-40 h-40 border-4 border-purple-500/20 rounded-full"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.5, 0.3],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 0.3,
                                        }}
                                    />
                                    <motion.div
                                        className="absolute w-48 h-48 border-4 border-pink-500/20 rounded-full"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.5, 0.3],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 0.6,
                                        }}
                                    />
                                </div>

                                <div className="relative z-10 text-center">
                                    <motion.div
                                        className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-6"
                                        animate={{
                                            scale: isProcessing ? [1, 1.2, 1] : 1,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: isProcessing ? Infinity : 0,
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                            />
                                        </svg>
                                    </motion.div>

                                    <motion.h3
                                        className="text-2xl font-bold text-white mb-2"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        {isProcessing ? "Processing..." : "Listening..."}
                                    </motion.h3>
                                    
                                    <p className="text-gray-400 mb-6">
                                        {isProcessing ? "Analyzing your command" : "Speak your command"}
                                    </p>

                                    <AnimatePresence mode="wait">
                                        {transcript && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="relative"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg blur" />
                                                <div className="relative bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                                    <p className="text-gray-200 font-medium">{transcript}</p>
                                                    {confidence > 0 && (
                                                        <div className="mt-2">
                                                            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${confidence * 100}%` }}
                                                                    transition={{ duration: 0.5 }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Confidence: {Math.round(confidence * 100)}%
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoiceNavigation;
