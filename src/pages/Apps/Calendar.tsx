import FullCalendar from '@fullcalendar/react';
// import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Fragment, useEffect, useState, useMemo, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconListCheck from '../../components/Icon/IconListCheck';
import '../Apps/Calendar.css';

const Calendar = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Task Management'));
    });
    const now = new Date();
    const getMonth = (dt: Date, add: number = 0) => {
        let month = dt.getMonth() + 1 + add;
        const str = (month < 10 ? '0' + month : month).toString();
        return str;
        // return dt.getMonth() < 10 ? '0' + month : month;
    };

    const [events, setEvents] = useState<any>([
        {
            id: 1,
            title: 'Project Planning Meeting',
            start: now.getFullYear() + '-' + getMonth(now) + '-01T10:00:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-01T11:30:00',
            className: 'danger',
            description: 'Quarterly project planning and resource allocation meeting with stakeholders',
            status: 'PENDING',
            priority: 'HIGH',
            category: 'MEETING',
            assignee: 'Sarah Wilson',
            department: 'Project Management',
            estimatedHours: 1.5,
            progress: 0
        },
        {
            id: 2,
            title: 'System Architecture Review',
            start: now.getFullYear() + '-' + getMonth(now) + '-03T14:00:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-03T16:00:00',
            className: 'primary',
            description: 'Technical review of system architecture and infrastructure scalability',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            category: 'TECHNICAL',
            assignee: 'Michael Chen',
            department: 'Engineering',
            estimatedHours: 2,
            progress: 60
        },
        {
            id: 3,
            title: 'Client Requirements Analysis',
            start: now.getFullYear() + '-' + getMonth(now) + '-05T09:00:00',
            end: now.getFullYear() + '-' + getMonth(now) + '-05T17:00:00',
            className: 'info',
            description: 'Detailed analysis of client requirements and documentation preparation',
            status: 'COMPLETED',
            priority: 'MEDIUM',
            category: 'ANALYSIS',
            assignee: 'Emily Rodriguez',
            department: 'Business Analysis',
            estimatedHours: 8,
            progress: 100
        }
    ]);

    const [visibleEvents, setVisibleEvents] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [scrollTop, setScrollTop] = useState(0);
    const [viewMode, setViewMode] = useState<'calendar' | 'gantt'>('calendar');
    const pageSize = 50; // Number of events to load at once

    // Function to add a new task
    const addTask = (taskData: any) => {
        const newTask = {
            id: events.length + 1,
            ...taskData,
            className: getTaskClassName(taskData.priority),
        };
        setEvents(prev => [...prev, newTask]);
        setVisibleEvents(prev => [...prev, newTask]);
    };

    // Function to get className based on priority
    const getTaskClassName = (priority: string) => {
        switch (priority.toUpperCase()) {
            case 'HIGH':
                return 'danger';
            case 'MEDIUM':
                return 'warning';
            case 'LOW':
                return 'success';
            default:
                return 'primary';
        }
    };

    // Load initial events
    useEffect(() => {
        const initialEvents = events.slice(0, itemsPerPage);
        setVisibleEvents(initialEvents);
    }, []);

    // Function to load events in chunks
    const loadEvents = (start: Date, end: Date) => {
        setIsLoading(true);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        const filteredEvents = events.filter((event: any) => {
            const eventStart = new Date(event.start);
            return eventStart >= start && eventStart <= end;
        });

        const newEvents = filteredEvents.slice(startIndex, endIndex);
        setVisibleEvents(prev => [...prev, ...newEvents]);
        setIsLoading(false);
    };

    // Handle form submission for new task
    const handleAddTask = (formData: any) => {
        const newTask = {
            title: formData.title,
            start: formData.start,
            end: formData.end,
            description: formData.description,
            status: formData.status || 'PENDING',
            priority: formData.priority || 'MEDIUM',
            category: formData.category || 'GENERAL',
            assignee: formData.assignee,
            department: formData.department,
            estimatedHours: formData.estimatedHours || 0,
            progress: 0
        };
        addTask(newTask);
        Swal.fire('Success!', 'Task has been added successfully.', 'success');
    };

    // Handle calendar date range change
    const handleDatesSet = (arg: any) => {
        loadEvents(arg.start, arg.end);
    };

    // Unified scroll handler for both calendar and list views
    const handleScroll = (info?: any) => {
        // Handle calendar scroll
        if (info) {
            const { scrollTop, scrollHeight, clientHeight } = info.target;
            if (!isLoading && scrollTop + clientHeight >= scrollHeight - 100) {
                setCurrentPage(prev => prev + 1);
                loadEvents(info.view.activeStart, info.view.activeEnd);
            }
        }
        
        // Handle list view scroll
        if (containerRef.current) {
            const { scrollTop, clientHeight } = containerRef.current;
            const start = Math.floor(scrollTop / ROW_HEIGHT);
            const end = Math.min(
                start + Math.ceil(clientHeight / ROW_HEIGHT),
                events.length
            );
            setVisibleRange({ start, end });
            setScrollTop(scrollTop);
        }
    };

    // Optimize rendering with useMemo
    const calendarOptions = useMemo(() => ({
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: visibleEvents,
        datesSet: handleDatesSet,
        eventDidMount: (info: any) => {
            // Add tooltip with event details
            const tooltip = new Tooltip(info.el, {
                title: `${info.event.title}\n${info.event.extendedProps.description || ''}`,
                placement: 'top',
                trigger: 'hover',
                container: 'body'
            });
        },
        scrollTime: '00:00',
        height: 'auto',
        eventContent: (arg: any) => {
            return {
                html: `
                    <div class="fc-content">
                        <div class="fc-title" style="font-weight: bold;">${arg.event.title}</div>
                        <div class="fc-description" style="font-size: 0.8em;">
                            ${arg.event.extendedProps.status} | ${arg.event.extendedProps.priority}
                        </div>
                    </div>
                `
            };
        }
    }), [visibleEvents]);

    // Group events by category for better organization
    const groupedEvents = useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        visibleEvents.forEach((event: any) => {
            const key = event.category || 'Ungrouped';
            if (!groups[key]) groups[key] = [];
            groups[key].push(event);
        });
        return groups;
    }, [visibleEvents]);

    const taskCategories = [
        { value: 'DEVELOPMENT', label: 'Development', color: 'primary' },
        { value: 'MEETING', label: 'Meeting', color: 'info' },
        { value: 'TECHNICAL', label: 'Technical', color: 'danger' },
        { value: 'ANALYSIS', label: 'Analysis', color: 'success' },
        { value: 'DOCUMENTATION', label: 'Documentation', color: 'warning' }
    ];

    const taskStatuses = [
        { value: 'PENDING', label: 'Pending', color: 'warning' },
        { value: 'IN_PROGRESS', label: 'In Progress', color: 'info' },
        { value: 'REVIEW', label: 'Under Review', color: 'primary' },
        { value: 'COMPLETED', label: 'Completed', color: 'success' },
        { value: 'ON_HOLD', label: 'On Hold', color: 'danger' }
    ];

    const taskPriorities = [
        { value: 'LOW', label: 'Low Priority', color: 'success' },
        { value: 'MEDIUM', label: 'Medium Priority', color: 'warning' },
        { value: 'HIGH', label: 'High Priority', color: 'danger' }
    ];

    const departments = [
        'Engineering',
        'Project Management',
        'Business Analysis',
        'Quality Assurance',
        'DevOps',
        'Design',
        'Marketing'
    ];

    const [filterParams, setFilterParams] = useState<any>({
        status: '',
        priority: '',
        category: '',
        department: '',
        assignee: '',
        dateRange: 'all',
        startDate: '',
        endDate: '',
        searchQuery: '',
        timeframe: 'month'
    });

    const [timelineView, setTimelineView] = useState({
        groupBy: 'none', // none, status, assignee, department
        viewMode: 'timeGridWeek'
    });

    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'custom', label: 'Custom Range' }
    ];

    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
    const [timeframe, setTimeframe] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Apply filters to events
        let filtered = [...events];
        
        if (filterParams.department) {
            filtered = filtered.filter(event => event.department === filterParams.department);
        }
        
        if (filterParams.status) {
            filtered = filtered.filter(event => event.status === filterParams.status);
        }
        
        setFilteredEvents(filtered);
    }, [events, filterParams]);

    const navigateTime = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (timeframe === 'day') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (timeframe === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (timeframe === 'month') {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        } else if (timeframe === 'quarter') {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getDateRange = () => {
        const start = new Date(currentDate);
        const end = new Date(currentDate);
        
        if (timeframe === 'day') {
            return start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        } else if (timeframe === 'week') {
            start.setDate(start.getDate() - start.getDay());
            end.setDate(end.getDate() + (6 - end.getDay()));
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else if (timeframe === 'month') {
            return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else if (timeframe === 'quarter') {
            const quarter = Math.floor(start.getMonth() / 3);
            return `Q${quarter + 1} ${start.getFullYear()}`;
        }
        return '';
    };

    const getFilteredEvents = () => {
        return events.filter((event: any) => {
            const matchesSearch = !filterParams.searchQuery || 
                event.title.toLowerCase().includes(filterParams.searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(filterParams.searchQuery.toLowerCase());

            const matchesStatus = !filterParams.status || event.status === filterParams.status;
            const matchesPriority = !filterParams.priority || event.priority === filterParams.priority;
            const matchesCategory = !filterParams.category || event.category === filterParams.category;
            const matchesDepartment = !filterParams.department || event.department === filterParams.department;
            const matchesAssignee = !filterParams.assignee || event.assignee === filterParams.assignee;

            let matchesDate = true;
            const eventStart = new Date(event.start);
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            switch (filterParams.dateRange) {
                case 'today':
                    matchesDate = eventStart.toDateString() === new Date().toDateString();
                    break;
                case 'week':
                    matchesDate = eventStart >= startOfWeek;
                    break;
                case 'month':
                    matchesDate = eventStart >= startOfMonth;
                    break;
                case 'custom':
                    const start = filterParams.startDate ? new Date(filterParams.startDate) : null;
                    const end = filterParams.endDate ? new Date(filterParams.endDate) : null;
                    matchesDate = (!start || eventStart >= start) && (!end || eventStart <= end);
                    break;
            }

            return matchesSearch && matchesStatus && matchesPriority && 
                   matchesCategory && matchesDepartment && matchesAssignee && matchesDate;
        });
    };

    const getGroupedEvents = () => {
        const filteredEvents = getFilteredEvents();
        if (timelineView.groupBy === 'none') return filteredEvents;

        const groups: any = {};
        filteredEvents.forEach((event: any) => {
            const groupKey = event[timelineView.groupBy];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(event);
        });

        return Object.entries(groups).map(([key, events]: [string, any]) => ({
            id: key,
            title: key,
            children: events
        }));
    };

    // Timeline customization
    const timelineCustomButtons = {
        groupByNone: {
            text: 'No Grouping',
            click: () => setTimelineView({ ...timelineView, groupBy: 'none' })
        },
        groupByStatus: {
            text: 'Group by Status',
            click: () => setTimelineView({ ...timelineView, groupBy: 'status' })
        },
        groupByAssignee: {
            text: 'Group by Assignee',
            click: () => setTimelineView({ ...timelineView, groupBy: 'assignee' })
        },
        groupByDepartment: {
            text: 'Group by Department',
            click: () => setTimelineView({ ...timelineView, groupBy: 'department' })
        }
    };

    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const applyFilters = () => {
        let filteredEvents = events.filter((event: any) => {
            return (
                (filterParams.status ? event.status === filterParams.status : true) &&
                (filterParams.priority ? event.priority === filterParams.priority : true) &&
                (filterParams.category ? event.category === filterParams.category : true) &&
                (filterParams.department ? event.department === filterParams.department : true) &&
                (filterParams.assignee ? event.assignee === filterParams.assignee : true)
            );
        });
        setEvents(filteredEvents);
    };

    const resetFilters = () => {
        setFilterParams({ status: '', priority: '', category: '', department: '', assignee: '' });
        setEvents([...events]); // Reset to original events
    };

    const [isAddEventModal, setIsAddEventModal] = useState(false);
    const [minStartDate, setMinStartDate] = useState<any>('');
    const [minEndDate, setMinEndDate] = useState<any>('');
    const defaultParams = { 
        id: null, 
        title: '', 
        start: '', 
        end: '', 
        description: '', 
        type: 'primary',
        status: 'PENDING',
        priority: 'MEDIUM',
        category: 'DEVELOPMENT',
        assignee: '',
        department: '',
        estimatedHours: 0,
        progress: 0
    };
    const [params, setParams] = useState<any>(defaultParams);
    const dateFormat = (dt: any) => {
        dt = new Date(dt);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
        return dt;
    };
    const editEvent = (data: any = null) => {
        let params = JSON.parse(JSON.stringify(defaultParams));
        setParams(params);
        if (data) {
            let obj = JSON.parse(JSON.stringify(data.event));
            setParams({
                id: obj.id ? obj.id : null,
                title: obj.title ? obj.title : null,
                start: dateFormat(obj.start),
                end: dateFormat(obj.end),
                type: obj.classNames ? obj.classNames[0] : 'primary',
                description: obj.extendedProps ? obj.extendedProps.description : '',
                status: obj.extendedProps ? obj.extendedProps.status : 'PENDING',
                priority: obj.extendedProps ? obj.extendedProps.priority : 'MEDIUM',
                category: obj.extendedProps ? obj.extendedProps.category : 'DEVELOPMENT',
                assignee: obj.extendedProps ? obj.extendedProps.assignee : '',
                department: obj.extendedProps ? obj.extendedProps.department : '',
                estimatedHours: obj.extendedProps ? obj.extendedProps.estimatedHours : 0,
                progress: obj.extendedProps ? obj.extendedProps.progress : 0
            });
            setMinStartDate(new Date());
            setMinEndDate(dateFormat(obj.start));
        } else {
            setMinStartDate(new Date());
            setMinEndDate(new Date());
        }
        setIsAddEventModal(true);
    };
    const editDate = (data: any) => {
        let obj = {
            event: {
                start: data.start,
                end: data.end,
            },
        };
        editEvent(obj);
    };

    const saveEvent = () => {
        if (!params.title) {
            return true;
        }
        if (!params.start) {
            return true;
        }
        if (!params.end) {
            return true;
        }
        if (params.id) {
            //update event
            let dataevent = events || [];
            let event: any = dataevent.find((d: any) => d.id === parseInt(params.id));
            event.title = params.title;
            event.start = params.start;
            event.end = params.end;
            event.description = params.description;
            event.className = params.type;
            event.status = params.status;
            event.priority = params.priority;
            event.category = params.category;
            event.assignee = params.assignee;
            event.department = params.department;
            event.estimatedHours = params.estimatedHours;
            event.progress = params.progress;

            setEvents([]);
            setTimeout(() => {
                setEvents(dataevent);
            });
        } else {
            //add event
            let maxEventId = 0;
            if (events) {
                maxEventId = events.reduce((max: number, character: any) => (character.id > max ? character.id : max), events[0].id);
            }
            maxEventId = maxEventId + 1;
            let event = {
                id: maxEventId,
                title: params.title,
                start: params.start,
                end: params.end,
                description: params.description,
                className: params.type,
                status: params.status,
                priority: params.priority,
                category: params.category,
                assignee: params.assignee,
                department: params.department,
                estimatedHours: params.estimatedHours,
                progress: params.progress
            };
            let dataevent = events || [];
            dataevent = dataevent.concat([event]);
            setTimeout(() => {
                setEvents(dataevent);
            });
        }
        showMessage('Event has been saved successfully.');
        setIsAddEventModal(false);
    };
    const startDateChange = (event: any) => {
        const dateStr = event.target.value;
        if (dateStr) {
            setMinEndDate(dateFormat(dateStr));
            setParams({ ...params, start: dateStr, end: '' });
        }
    };
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const ROW_HEIGHT = 80;
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

    useEffect(() => {
        if (containerRef.current) {
            handleScroll();
        }
    }, [events]);

    useEffect(() => {
        setVisibleEvents(events.slice(visibleRange.start, visibleRange.end));
    }, [events, visibleRange]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= Math.ceil(events.length / itemsPerPage)) {
            setCurrentPage(page);
            handleScroll();
        }
    };

    // Handle search and filter
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: string) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-5 flex items-center sm:flex-row flex-col sm:justify-between justify-center bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                    <div className="sm:mb-0 mb-4">
                        <div className="text-3xl font-bold ltr:sm:text-left rtl:sm:text-right text-center mb-2 text-primary">Task Management System</div>
                        <div className="text-gray-600 dark:text-gray-400 text-lg">Manage and track project tasks efficiently</div>
                        <div className="flex items-center mt-4 flex-wrap sm:justify-start justify-center">
                            {taskStatuses.map((status, index) => (
                                <div key={index} className="flex items-center ltr:mr-4 rtl:ml-4 mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    <div className={`h-3 w-3 rounded-full ltr:mr-2 rtl:ml-2 bg-${status.color}`}></div>
                                    <div className="text-sm font-medium">{status.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'} p-2`}
                            title="Calendar View"
                        >
                            <IconCalendar className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('gantt')}
                            className={`btn ${viewMode === 'gantt' ? 'btn-primary' : 'btn-outline-primary'} p-2`}
                            title="Gantt Chart"
                        >
                            <IconListCheck className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {viewMode === 'calendar' ? (
                    // Existing Calendar View
                    <div>
                        {/* Timeline Controls */}
                        <div className="mb-5 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(timelineCustomButtons).map(([key, button]) => (
                                        <button
                                            key={key}
                                            className={`btn ${timelineView.groupBy === key.replace('groupBy', '').toLowerCase() 
                                                ? 'btn-primary' 
                                                : 'btn-outline-primary'} hover:shadow-lg transition-all duration-300`}
                                            onClick={button.click}
                                        >
                                            {button.text}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className={`btn ${timelineView.viewMode === 'dayGridMonth' ? 'btn-primary' : 'btn-outline-primary'} hover:shadow-lg transition-all duration-300`}
                                        onClick={() => setTimelineView({ ...timelineView, viewMode: 'dayGridMonth' })}
                                    >
                                        Month
                                    </button>
                                    <button
                                        className={`btn ${timelineView.viewMode === 'timeGridWeek' ? 'btn-primary' : 'btn-outline-primary'} hover:shadow-lg transition-all duration-300`}
                                        onClick={() => setTimelineView({ ...timelineView, viewMode: 'timeGridWeek' })}
                                    >
                                        Week
                                    </button>
                                    <button
                                        className={`btn ${timelineView.viewMode === 'timeGridDay' ? 'btn-primary' : 'btn-outline-primary'} hover:shadow-lg transition-all duration-300`}
                                        onClick={() => setTimelineView({ ...timelineView, viewMode: 'timeGridDay' })}
                                    >
                                        Day
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Component */}
                        <div className="calendar-wrapper bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView={timelineView.viewMode}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                editable={true}
                                selectable={true}
                                droppable={true}
                                eventClick={(event: any) => editEvent(event)}
                                select={(event: any) => editDate(event)}
                                events={getGroupedEvents()}
                                resourceGroupField={timelineView.groupBy !== 'none' ? timelineView.groupBy : undefined}
                                dayMaxEventRows={false}
                                eventDisplay="block"
                                eventOverlap={true}
                                eventContent={(arg) => {
                                    // Get status color from taskStatuses
                                    const status = taskStatuses.find(s => s.value === arg.event.extendedProps.status);
                                    const statusColor = status ? status.color : 'gray';
                                    
                                    // Get priority color
                                    const priority = taskPriorities.find(p => p.value === arg.event.extendedProps.priority);
                                    const priorityColor = priority ? priority.color : 'gray';

                                    // Get concurrent events on the same day
                                    const eventDate = arg.event.start;
                                    const concurrentEvents = arg.view.calendar.getEvents().filter(event => {
                                        const sameDay = event.start?.toDateString() === eventDate?.toDateString();
                                        return sameDay;
                                    });
                                    
                                    // Calculate dynamic height based on number of concurrent events
                                    const baseHeight = 24; // Base height in pixels
                                    const minHeight = 16; // Minimum height in pixels
                                    const maxEvents = Math.max(concurrentEvents.length, 1);
                                    const dynamicHeight = Math.max(Math.floor(baseHeight / maxEvents), minHeight);
                                    
                                    return (
                                        <div 
                                            className={`task-event rounded-sm border bg-${statusColor}-100 border-${statusColor}-300 hover:shadow-md transition-all duration-300`}
                                            style={{ 
                                                height: `${dynamicHeight}px`,
                                                marginBottom: '1px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div className="flex items-center h-full gap-1 px-1">
                                                <div className={`h-1.5 w-1.5 rounded-full bg-${statusColor}-500 flex-shrink-0`}></div>
                                                <div className="font-medium text-xs truncate flex-grow">
                                                    {arg.event.title}
                                                </div>
                                                {timelineView.viewMode !== 'dayGridMonth' && (
                                                    <div className={`text-[10px] px-1 rounded bg-${priorityColor}-100 text-${priorityColor}-700 flex-shrink-0`}>
                                                        {arg.event.extendedProps.priority}
                                                    </div>
                                                )}
                                                {timelineView.groupBy === 'none' && dynamicHeight >= 20 && (
                                                    <span className="text-[10px] text-gray-500 truncate flex-shrink-0">
                                                        {arg.event.extendedProps.assignee}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }}
                                eventDidMount={(info) => {
                                    // Add subtle hover effect
                                    info.el.addEventListener('mouseenter', () => {
                                        info.el.style.transform = 'scale(1.01)';
                                        info.el.style.zIndex = '10';
                                    });
                                    info.el.addEventListener('mouseleave', () => {
                                        info.el.style.transform = 'scale(1)';
                                        info.el.style.zIndex = 'auto';
                                    });
                                }}
                                className="fc-theme-standard"
                            />
                        </div>
                    </div>
                ) : (
                    // Professional Gantt Chart View
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
                        {/* Professional Toolbar */}
                        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            className="btn btn-icon btn-sm" 
                                            onClick={() => navigateTime('prev')}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button 
                                            className="btn btn-icon btn-sm"
                                            onClick={() => navigateTime('next')}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            className="form-select form-select-sm"
                                            onChange={(e) => {
                                                setTimeframe(e.target.value);
                                                setFilterParams({ ...filterParams, timeframe: e.target.value });
                                            }}
                                            value={timeframe}
                                        >
                                            <option value="day">Day</option>
                                            <option value="week">Week</option>
                                            <option value="month">Month</option>
                                            <option value="quarter">Quarter</option>
                                        </select>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={goToToday}
                                        >
                                            Today
                                        </button>
                                    </div>
                                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <span className="text-sm font-medium">{getDateRange()}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <select
                                            className="form-select form-select-sm min-w-[150px]"
                                            onChange={(e) => setFilterParams({ ...filterParams, department: e.target.value })}
                                            value={filterParams.department}
                                        >
                                            <option value="">All Departments</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-select form-select-sm min-w-[150px]"
                                            onChange={(e) => setFilterParams({ ...filterParams, status: e.target.value })}
                                            value={filterParams.status}
                                        >
                                            <option value="">All Statuses</option>
                                            {taskStatuses.map((status) => (
                                                <option key={status.value} value={status.value}>{status.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm whitespace-nowrap"
                                        onClick={() => editEvent()}
                                    >
                                        <IconPlus className="w-4 h-4 mr-1" />
                                        New Task
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="gantt-controls">
                            <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => handleStatusFilter(e.target.value)}
                                    className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="inprogress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing {visibleEvents.length} of {events.length} tasks
                                </div>
                            </div>
                        </div>

                        {/* Gantt Header */}
                        <div className="gantt-header">
                            <div className="gantt-sidebar-header">
                                <div className="task-column">Task</div>
                            </div>
                            <div className="gantt-timeline-header">
                                <div className="month-row expanded">
                                    <div className="month-cell">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                                </div>
                                <div className="days-row">
                                    {Array.from({ length: 31 }, (_, i) => {
                                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                        const isToday = date.toDateString() === new Date().toDateString();
                                        
                                        return (
                                            <div 
                                                key={i} 
                                                className={`day-cell ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}
                                            >
                                                <span className="day-number">{i + 1}</span>
                                                <span className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                {isWeekend && <div className="weekend-indicator" />}
                                                {isToday && <div className="today-indicator" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Gantt Body */}
                        <div className="gantt-body">
                            {/* Sidebar */}
                            <div 
                                className="gantt-sidebar" 
                                ref={containerRef}
                                onScroll={handleScroll}
                            >
                                <div
                                    style={{
                                        height: `${events.length * ROW_HEIGHT}px`,
                                        position: 'relative'
                                    }}
                                >
                                    {visibleEvents.map((event, index) => {
                                        const absoluteIndex = visibleRange.start + index;
                                        return (
                                            <div
                                                key={absoluteIndex}
                                                className="task-row"
                                                style={{
                                                    position: 'absolute',
                                                    top: `${(visibleRange.start + index) * ROW_HEIGHT}px`,
                                                    height: `${ROW_HEIGHT}px`,
                                                    width: '100%'
                                                }}
                                            >
                                                {/* Task Info */}
                                                <div className="task-info enhanced-ui">
                                                    <div className="task-title">{event.title}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div 
                                className="gantt-timeline"
                                onScroll={(e) => {
                                    if (containerRef.current) {
                                        containerRef.current.scrollTop = e.currentTarget.scrollTop;
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        height: `${events.length * ROW_HEIGHT}px`,
                                        position: 'relative'
                                    }}
                                >
                                    {visibleEvents.map((event, index) => {
                                        const absoluteIndex = visibleRange.start + index;
                                        const startDay = new Date(event.start).getDate();
                                        const endDay = new Date(event.end).getDate();
                                        const duration = endDay - startDay + 1;

                                        return (
                                            <div
                                                key={absoluteIndex}
                                                className="timeline-row"
                                                style={{
                                                    position: 'absolute',
                                                    top: `${(visibleRange.start + index) * ROW_HEIGHT}px`,
                                                    height: `${ROW_HEIGHT}px`,
                                                    width: '100%'
                                                }}
                                            >
                                                <div 
                                                    className={`task-bar status-${event.extendedProps?.status?.toLowerCase() || 'pending'}`}
                                                    style={{
                                                        left: `${(startDay - 1) * (100 / 31)}%`,
                                                        width: `${duration * (100 / 31)}%`
                                                    }}
                                                    onClick={() => editEvent({ event: { id: event.id, title: event.title, start: event.start, end: event.end, extendedProps: event.extendedProps } })}
                                                >
                                                    <div className="task-bar-content">
                                                        <div className="task-bar-info">
                                                            <span className="task-bar-title">{event.title}</span>
                                                            <span className="task-bar-dates">
                                                                {new Date(event.start).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })} - {new Date(event.end).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        <div className="gantt-pagination">
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Page {currentPage} of {Math.ceil(events.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(events.length / itemsPerPage)}
                                        className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Tasks: {events.length}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Event Modal */}
            <Transition appear show={isAddEventModal} as={Fragment}>
                <Dialog as="div" onClose={() => setIsAddEventModal(false)} open={isAddEventModal} className="relative z-[51]">
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        onClick={() => setIsAddEventModal(false)}
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? 'Edit Task' : 'Add Task'}
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="title" className="form-label">Task Title</label>
                                                    <input
                                                        id="title"
                                                        type="text"
                                                        name="title"
                                                        className="form-input"
                                                        placeholder="Enter task title"
                                                        value={params.title || ''}
                                                        onChange={(e) => changeValue(e)}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="category" className="form-label">Category</label>
                                                    <select
                                                        id="category"
                                                        name="category"
                                                        className="form-select"
                                                        value={params.category || ''}
                                                        onChange={(e) => changeValue(e)}
                                                    >
                                                        {taskCategories.map((category, index) => (
                                                            <option key={index} value={category.value}>
                                                                {category.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="start" className="form-label">Start Date & Time</label>
                                                    <input
                                                        id="start"
                                                        type="datetime-local"
                                                        name="start"
                                                        className="form-input"
                                                        value={params.start || ''}
                                                        min={minStartDate}
                                                        onChange={(event: any) => startDateChange(event)}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="end" className="form-label">End Date & Time</label>
                                                    <input
                                                        id="end"
                                                        type="datetime-local"
                                                        name="end"
                                                        className="form-input"
                                                        value={params.end || ''}
                                                        min={minEndDate}
                                                        onChange={(e) => changeValue(e)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="description" className="form-label">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    className="form-textarea min-h-[100px]"
                                                    placeholder="Enter detailed task description"
                                                    value={params.description || ''}
                                                    onChange={(e) => changeValue(e)}
                                                ></textarea>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="form-label">Status</label>
                                                    <div className="flex flex-col space-y-2">
                                                        {taskStatuses.map((status, index) => (
                                                            <label key={index} className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    className={`form-radio text-${status.color}`}
                                                                    name="status"
                                                                    value={status.value}
                                                                    checked={params.status === status.value}
                                                                    onChange={(e) => setParams({ ...params, status: e.target.value })}
                                                                />
                                                                <span className="ltr:ml-2 rtl:mr-2">{status.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="form-label">Priority</label>
                                                    <div className="flex flex-col space-y-2">
                                                        {taskPriorities.map((priority, index) => (
                                                            <label key={index} className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    className={`form-radio text-${priority.color}`}
                                                                    name="priority"
                                                                    value={priority.value}
                                                                    checked={params.priority === priority.value}
                                                                    onChange={(e) => setParams({ ...params, priority: e.target.value })}
                                                                />
                                                                <span className="ltr:ml-2 rtl:mr-2">{priority.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="department" className="form-label">Department</label>
                                                    <select
                                                        id="department"
                                                        name="department"
                                                        className="form-select"
                                                        value={params.department || ''}
                                                        onChange={(e) => changeValue(e)}
                                                    >
                                                        <option value="">Select Department</option>
                                                        {departments.map((dept, index) => (
                                                            <option key={index} value={dept}>
                                                                {dept}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="assignee" className="form-label">Assignee</label>
                                                    <input
                                                        id="assignee"
                                                        type="text"
                                                        name="assignee"
                                                        className="form-input"
                                                        placeholder="Enter assignee name"
                                                        value={params.assignee || ''}
                                                        onChange={(e) => changeValue(e)}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="estimatedHours" className="form-label">Estimated Hours</label>
                                                    <input
                                                        id="estimatedHours"
                                                        type="number"
                                                        name="estimatedHours"
                                                        className="form-input"
                                                        placeholder="Enter estimated hours"
                                                        value={params.estimatedHours || ''}
                                                        onChange={(e) => changeValue(e)}
                                                        min="0"
                                                        step="0.5"
                                                    />
                                                </div>
                                            </div>

                                            {params.id && (
                                                <div>
                                                    <label htmlFor="progress" className="form-label">Progress (%)</label>
                                                    <input
                                                        id="progress"
                                                        type="range"
                                                        name="progress"
                                                        className="form-range"
                                                        min="0"
                                                        max="100"
                                                        value={params.progress || 0}
                                                        onChange={(e) => changeValue(e)}
                                                    />
                                                    <div className="text-right text-sm text-gray-500">{params.progress}%</div>
                                                </div>
                                            )}

                                            <div className="flex justify-end items-center !mt-8">
                                                <button type="button" className="btn btn-outline-danger ltr:mr-3 rtl:ml-3" onClick={() => setIsAddEventModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary" onClick={() => saveEvent()}>
                                                    {params.id ? 'Update Task' : 'Create Task'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Calendar;
