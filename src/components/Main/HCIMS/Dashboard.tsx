import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import ReactApexChart from 'react-apexcharts';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Dropdown from '../../../components/Dropdown';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import IconTrendingUp from '../../../components/Icon/IconTrendingUp';
import IconPlus from '../../../components/Icon/IconPlus';
import IconCreditCard from '../../../components/Icon/IconCreditCard';
import IconCode from '../../../components/Icon/IconCode';

import { Responsive, WidthProvider } from 'react-grid-layout';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Modal from 'react-modal';

// Ensure modal is attached to the correct element
Modal.setAppElement('#root');

// Responsive Grid Layout setup
const ResponsiveGridLayout = WidthProvider(Responsive);

// Chart types and themes for Select options
const chartTypes = [
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
  { value: 'radar', label: 'Radar' },
  { value: 'donut', label: 'Donut' }
];

// Updated color schemes based on user input (Removed white color from Scheme 1)
const colorThemes = [

  { value: 'default', label: 'Default', colors: ['#236192', '#772583'] },
  { value: 'dark', label: 'Dark', colors: ['#2196F3', '#E7515A'] },
  { value: 'theme1', label: 'Theme 1', colors: ['#FF5733', '#33FFBD'] },
  { value: 'theme2', label: 'Theme 2', colors: ['#FF33F6', '#33FF57'] },
  { value: 'scheme1', label: 'Scheme 1', colors: ['#1B55E2', '#E7515A'] } // Removed white
];

// New filter options for advanced search
const documentTypes = [
  { value: 'report', label: 'Report' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'presentation', label: 'Presentation' }
];
const totalVisit: any = {
  series: [{ data: [21, 9, 36, 12, 44, 25, 59, 41, 10, 25] }],
  options: {
      chart: {
          height: 58,
          type: 'line',
          fontFamily: 'Nunito, sans-serif',
          sparkline: {
              enabled: true,
          },
          dropShadow: {
              enabled: true,
              blur: 3,
              color: '#009688',
              opacity: 0.4,
          },
      },
      stroke: {
          curve: 'smooth',
          width: 2,
      },
      colors: ['#009688'],
      grid: {
          padding: {
              top: 5,
              bottom: 5,
              left: 5,
              right: 5,
          },
      },
      tooltip: {
          x: {
              show: false,
          },
          y: {
              title: {
                  formatter: () => {
                      return '';
                  },
              },
          },
      },
  },
};    const paidVisit: any = {
  series: [{ data: [22, 19, 30, 47, 100, 44, 34, 55, 41, 69] }],
  options: {
      chart: {
          height: 58,
          type: 'line',
          fontFamily: 'Nunito, sans-serif',
          sparkline: {
              enabled: true,
          },
          dropShadow: {
              enabled: true,
              blur: 3,
              color: '#e2a03f',
              opacity: 0.4,
          },
      },
      stroke: {
          curve: 'smooth',
          width: 2,
      },
      colors: ['#e2a03f'],
      grid: {
          padding: {
              top: 5,
              bottom: 5,
              left: 5,
              right: 5,
          },
      },
      tooltip: {
          x: {
              show: false,
          },
          y: {
              title: {
                  formatter: () => {
                      return '';
                  },
              },
          },
      },
  },
};
const versions = [
  { value: 'v1', label: 'Version 1' },
  { value: 'v2', label: 'Version 2' },
  { value: 'v3', label: 'Version 3' }
];

const responsibleOptions = [
  { value: 'john_doe', label: 'John Doe' },
  { value: 'jane_smith', label: 'Jane Smith' },
  { value: 'alex_jones', label: 'Alex Jones' }
];

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' }
];

const widgetTypes = [
  { value: 'chart', label: 'Chart' },
  { value: 'table', label: 'Table' },
  { value: 'summary', label: 'Summary' },
];

const Index = () => {
  const dispatch = useDispatch();
  const dashboardRef = useRef(null);

  // States for handling various user inputs and selections
  const [searchQuery, setSearchQuery] = useState('');
  const [customContainers, setCustomContainers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalWidth, setModalWidth] = useState(4);
  const [modalHeight, setModalHeight] = useState(4);
  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetDescription, setWidgetDescription] = useState('');
  const [selectedWidgetType, setSelectedWidgetType] = useState(widgetTypes[0]);
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    return savedLayouts ? JSON.parse(savedLayouts) : {
      lg: [
        { i: 'revenueChart', x: 0, y: 0, w: 8, h: 12 },
        { i: 'GovernanceByCategory', x: 8, y: 0, w: 4, h: 12 },
        { i: 'procedurePanel', x: 0, y: 4, w: 12, h: 12 }
      ],
      md: [
        { i: 'revenueChart', x: 0, y: 0, w: 6, h: 12 },
        { i: 'GovernanceByCategory', x: 8, y: 0, w: 4, h: 12 },
        { i: 'procedurePanel', x: 0, y: 4, w: 12, h: 12 }
      ],
      sm: [
        { i: 'revenueChart', x: 0, y: 0, w: 12, h: 12 },
        { i: 'GovernanceByCategory', x: 0, y: 1, w: 12, h: 12 },
        { i: 'procedurePanel', x: 0, y: 2, w: 12, h: 12 }
      ]
    };
  });

  // Dynamic state for handling extra widget-specific configurations
  const [chartType, setChartType] = useState(chartTypes[0]);
  const [tableData, setTableData] = useState([{ name: '', value: '' }]); // Example for table
  const [summaryText, setSummaryText] = useState('');

  // Advanced filter states
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedResponsible, setSelectedResponsible] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Chart configuration states with localStorage persistence
  const [chartType1, setChartType1] = useState(() => localStorage.getItem('chartType1') || 'area');
  const [chartType2, setChartType2] = useState(() => localStorage.getItem('chartType2') || 'donut');
  const [chartType3, setChartType3] = useState(() => localStorage.getItem('chartType3') || 'radar');
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('colorTheme') || colorThemes[0].value);

  // Retrieve theme settings from Redux store
  const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass === 'rtl'); // Correctly define isRtl

  // Load containers from localStorage when the component mounts
  useEffect(() => {
    dispatch(setPageTitle('Governance'));

    
  }, [dispatch]);

  // Save containers to localStorage whenever the customContainers state changes
  useEffect(() => {
    if (customContainers.length > 0) {
      localStorage.setItem('customContainers', JSON.stringify(customContainers));
    }
  }, [customContainers]);

  // Save layout changes to localStorage
  const onLayoutChange = (layout, layouts) => {
    localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
    setLayouts(layouts);
  };

  // Layout settings for responsive grid
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  // Retrieve selected color scheme
  const getSelectedThemeColors = () => {
    const selectedTheme = colorThemes.find(theme => theme.value === colorTheme);
    return selectedTheme ? selectedTheme.colors : ['#1B55E2', '#E7515A']; // Default colors
  };

  const revenueChart = {
    series: [
      { name: 'Income', data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000] },
      { name: 'Expenses', data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000] }
    ],
    options: {
      chart: { height: 325, type: chartType1, zoom: { enabled: false }, toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2 },
      colors: getSelectedThemeColors(),
      xaxis: {
        labels: { style: { fontSize: '12px' }, offsetX: isRtl ? 2 : 0 },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        labels: {
          formatter: (value: number) => value / 1000 + 'K',
          offsetX: isRtl ? -30 : -10
        },
        opposite: isRtl
      },
      grid: { borderColor: isDark ? '#191E3A' : '#E0E6ED' }
    }
  };

  const GovernanceByCategory = {
    series: [985, 737, 270],
    options: {
      chart: { type: chartType2, height: 460 },
      colors: getSelectedThemeColors(),
      stroke: { show: true, width: 25, colors: isDark ? '#0e1726' : '#fff' },
      legend: { position: 'bottom' },
      plotOptions: { pie: { donut: { size: '65%' } } },
      labels: ['Approve', 'Rejected', 'Others']
    }
  };

  const procedureChart = {
    series: [{ name: 'Procedures', data: [80, 90, 70, 60, 85, 100] }],
    options: {
      chart: { type: chartType3, height: 350 },
      colors: getSelectedThemeColors(),
      labels: ['Procedure A', 'Procedure B', 'Procedure C', 'Procedure D', 'Procedure E', 'Procedure F'],
      stroke: { show: true, width: 2 }
    }
  };

  const handleChartTypeChange = (selectedType, chart) => {
    if (selectedType && selectedType.value) {
      if (chart === 'revenue') {
        setChartType1(selectedType.value);
        localStorage.setItem('chartType1', selectedType.value);
      }
      if (chart === 'Governance') {
        setChartType2(selectedType.value);
        localStorage.setItem('chartType2', selectedType.value);
      }
      if (chart === 'procedure') {
        setChartType3(selectedType.value);
        localStorage.setItem('chartType3', selectedType.value);
      }
    }
  };

  const handleColorThemeChange = (selectedTheme) => {
    if (selectedTheme && selectedTheme.value) {
      setColorTheme(selectedTheme.value);
      localStorage.setItem('colorTheme', selectedTheme.value);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
    setModalWidth(4);
    setModalHeight(4);
    setWidgetTitle('');
    setWidgetDescription('');
    setTableData([{ name: '', value: '' }]); // Reset table data
    setSummaryText(''); // Reset summary text
  };

  const addCustomContainer = () => {
    if (widgetTitle && modalWidth && modalHeight) {
      let newContainer = { title: widgetTitle, description: widgetDescription, w: modalWidth, h: modalHeight, type: selectedWidgetType.value };
  
      if (selectedWidgetType.value === 'chart') {
        // Ensure ReactApexChart is rendered as JSX, not an object
        newContainer = {
          ...newContainer,
          content: (
            <ReactApexChart
              type={chartType.value}
              height={300}
              series={[{ data: [10, 20, 30] }]} // Example data
              options={{ chart: { type: chartType.value } }} // Example options
            />
          ),
        };
      } else if (selectedWidgetType.value === 'table') {
        // Render table rows properly as JSX
        newContainer = {
          ...newContainer,
          content: (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.name}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ),
        };
      } else if (selectedWidgetType.value === 'summary') {
        // Render summary text properly
        newContainer = {
          ...newContainer,
          content: <p>{summaryText}</p>,
        };
      }
  
      setCustomContainers([...customContainers, newContainer]);
      closeModal();
    }
  };
  

  // Function to handle adding new rows to the table
  const handleTableRowChange = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

  const addTableRow = () => {
    setTableData([...tableData, { name: '', value: '' }]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const chartContent = dashboardRef.current;

    if (chartContent) {
      doc.html(chartContent, {
        callback: (pdf) => {
          pdf.save('dashboard.pdf');
        },
        x: 10,
        y: 10,
        width: 200,
        windowWidth: 900
      });
    }
  };

  return (
    <div ref={dashboardRef}>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/" className="text-primary hover:underline">Dashboard</Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>HRMS</span>
        </li>
      </ul>

      {/* Filters in one row */} 

    
      <br /><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    {/* Panel 1: Attendance */}
    <div className="panel h-full sm:col-span-2 lg:col-span-1 bg-[#ffffff] shadow-md rounded-lg">
        <div className="flex justify-between text-[#236192] mb-5">
            <h5 className="font-semibold text-lg">Attendance</h5>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={` {isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-[#772583]"
                    button={
                        <IconHorizontalDots className="text-[#236192] hover:!text-[#772583]" />
                    }
                >
                    <ul>
                        <li>
                            <button type="button">This Week</button>
                        </li>
                        <li>
                            <button type="button">Last Week</button>
                        </li>
                        <li>
                            <button type="button">This Month</button>
                        </li>
                        <li>
                            <button type="button">Last Month</button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#236192] font-bold">
            <div>
                <div>
                    <div>Total Employees</div>
                    <div className="text-[#772583] text-lg">1,234</div>
                </div>
                <ReactApexChart
                    series={totalVisit.series}
                    options={totalVisit.options}
                    type="line"
                    height={58}
                    className="overflow-hidden"
                />
            </div>
            <div>
                <div>
                    <div>Present Employees</div>
                    <div className="text-[#772583] text-lg">1,089</div>
                </div>
                <ReactApexChart
                    series={paidVisit.series}
                    options={paidVisit.options}
                    type="line"
                    height={58}
                    className="overflow-hidden"
                />
            </div>
        </div>
    </div>

    {/* Panel 2: Pending Appraisals */}
    <div className="panel h-full bg-[#ffffff] shadow-md rounded-lg">
        <div className="flex justify-between text-[#236192] mb-5">
            <h5 className="font-semibold text-lg">Pending Appraisals</h5>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={` {isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-[#772583]"
                    button={
                        <IconHorizontalDots className="text-[#236192] hover:!text-[#772583]" />
                    }
                >
                    <ul>
                        <li>
                            <button type="button">This Week</button>
                        </li>
                        <li>
                            <button type="button">Last Week</button>
                        </li>
                        <li>
                            <button type="button">This Month</button>
                        </li>
                        <li>
                            <button type="button">Last Month</button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <div className="text-[#772583] text-3xl font-bold my-10">
            <span>45</span>
            <span className="text-[#236192] text-sm ltr:mr-2 rtl:ml-2">pending reviews</span>
            <IconTrendingUp className="text-[#236192] inline" />
        </div>
        <div className="flex items-center justify-between">
            <div className="w-full rounded-full h-5 p-1 bg-[#236192]/20 overflow-hidden shadow-3xl">
                <div
                    className="bg-gradient-to-r from-[#236192] to-[#772583] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-[#ffffff] before:w-2 before:h-2 before:rounded-full before:m-auto"
                    style={{ width: "65%" }}
                ></div>
            </div>
            <span className="ltr:ml-5 rtl:mr-5 text-[#236192]">15 upcoming</span>
        </div>
    </div>

    {/* Panel 3: KPIs Tracking */}
    <div
        className="panel h-full overflow-hidden before:bg-[#236192] before:absolute before:-right-44 before:top-0 before:bottom-0 before:m-auto before:rounded-full before:w-96 before:h-96 grid grid-cols-1 content-between"
        style={{ background: "linear-gradient(0deg, #236192, #772583)" }}
    >
        <div className="flex items-start justify-between text-[#ffffff] mb-16 z-[7]">
            <h5 className="font-semibold text-lg">KPIs Tracking</h5>
            <div className="relative text-xl whitespace-nowrap">
                85%
               
            </div>
        </div>
        <div className="flex items-center justify-between z-10">
            <div className="flex flex-col text-white">
                <span className="mb-2">Company Performance: 85%</span>
                <span className="mb-2">Departmental: 78%</span>
                <span>Individual: 92%</span>
            </div>
            <button
                type="button"
                className="shadow-[0_0_2px_0_#ffffff] rounded p-1 text-[#ffffff] hover:bg-[#772583] z-10"
            >
                View Details
            </button>
        </div>
    </div>
</div>

               
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}
      >
        
        <div key="revenueChart" className="panel">
          <h5 className="font-semibold text-lg dark:text-white-light mb-5">Training Completion</h5>
          <Select
            options={chartTypes}
            value={chartTypes.find((type) => type.value === chartType1)}
            onChange={(selectedType) => handleChartTypeChange(selectedType, 'revenue')}
            className="mb-4"
          />
          <ReactApexChart series={[
            { 
              name: 'Assigned Training',
              data: [85, 75, 90, 80, 85, 92, 88]
            },
            {
              name: 'Completed Training',
              data: [75, 65, 85, 70, 80, 85, 78]
            }
          ]} options={{
            ...revenueChart.options,
            xaxis: {
              ...revenueChart.options.xaxis,
              categories: ['HR', 'IT', 'Finance', 'Sales', 'Marketing', 'Operations', 'Admin']
            },
            yaxis: {
              labels: {
                formatter: (value: number) => value + '%'
              }
            }
          }} type={chartType1} height={350} />
        </div>

        <div key="GovernanceByCategory" className="panel">
          <h5 className="font-semibold text-lg dark:text-white-light mb-5">Attendance Overview</h5>
          <Select
            options={chartTypes}
            value={chartTypes.find((type) => type.value === chartType2)}
            onChange={(selectedType) => handleChartTypeChange(selectedType, 'Governance')}
            className="mb-4"
          />
          <ReactApexChart series={[1089, 95, 50]} options={{
            ...GovernanceByCategory.options,
            labels: ['Present', 'Absent', 'On Leave']
          }} type={chartType2} height={350} />
        </div>
        
        <div key="procedurePanel" className="panel">
          <h5 className="font-semibold text-lg dark:text-white-light mb-5">KPI Performance Radar</h5>
          <Select
            options={chartTypes}
            value={chartTypes.find((type) => type.value === chartType3)}
            onChange={(selectedType) => handleChartTypeChange(selectedType, 'procedure')}
            className="mb-4"
          />
          <ReactApexChart series={[{
            name: 'Performance',
            data: [85, 78, 92, 88, 76, 89]
          }]} options={{
            ...procedureChart.options,
            labels: ['Company KPIs', 'Department KPIs', 'Individual KPIs', 'Training Goals', 'Attendance', 'Reviews']
          }} type={chartType3} height={350} />
        </div>

        {customContainers.map((container, idx) => (
          <div key={`customContainer- ${idx}`} className="panel" data-grid={{ x: 0, y: 4 + idx, w: container.w, h: container.h }}>
            <h5 className="font-semibold text-lg dark:text-white-light mb-5">{container.title}</h5>
            <p>{container.description}</p>
            <div>{container.content}</div>
          </div>
        ))}
      </ResponsiveGridLayout>
      <div className="panel h-full w-full bg-[#ffffff] shadow-md rounded-lg">
    <div className="flex items-center justify-between mb-5 text-[#236192]">
        <h5 className="font-semibold text-lg">Exceptions Overview</h5>
    </div>
    <div className="table-responsive">
        <table className="w-full text-sm text-left text-[#236192]">
            <thead className="bg-[#236192] text-white">
                <tr>
                    <th className="px-4 py-2 ltr:rounded-l-md rtl:rounded-r-md">Exception Name</th>
                    <th className="px-4 py-2">Start Date</th>
                    <th className="px-4 py-2">End Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 ltr:rounded-r-md rtl:rounded-l-md">Risk Value</th>
                </tr>
            </thead>
            <tbody>
                <tr className="hover:bg-[#236192]/10">
                    <td className="px-4 py-2">
                        <span className="whitespace-nowrap">Data Breach Alert</span>
                    </td>
                    <td className="px-4 py-2">2024-11-01</td>
                    <td className="px-4 py-2">2024-11-10</td>
                    <td className="px-4 py-2">
                        <span className="badge bg-[#236192] text-white py-1 px-2 rounded">Resolved</span>
                    </td>
                    <td className="px-4 py-2 text-[#772583]">High</td>
                </tr>
                <tr className="hover:bg-[#236192]/10">
                    <td className="px-4 py-2">
                        <span className="whitespace-nowrap">Unauthorized Access</span>
                    </td>
                    <td className="px-4 py-2">2024-11-05</td>
                    <td className="px-4 py-2">2024-11-12</td>
                    <td className="px-4 py-2">
                        <span className="badge bg-[#772583] text-white py-1 px-2 rounded">In Progress</span>
                    </td>
                    <td className="px-4 py-2 text-[#772583]">Medium</td>
                </tr>
                <tr className="hover:bg-[#236192]/10">
                    <td className="px-4 py-2">
                        <span className="whitespace-nowrap">System Downtime</span>
                    </td>
                    <td className="px-4 py-2">2024-11-08</td>
                    <td className="px-4 py-2">2024-11-15</td>
                    <td className="px-4 py-2">
                        <span className="badge bg-[#f8538d] text-white py-1 px-2 rounded">Unresolved</span>
                    </td>
                    <td className="px-4 py-2 text-[#772583]">High</td>
                </tr>
                <tr className="hover:bg-[#236192]/10">
                    <td className="px-4 py-2">
                        <span className="whitespace-nowrap">Phishing Attempt</span>
                    </td>
                    <td className="px-4 py-2">2024-11-09</td>
                    <td className="px-4 py-2">2024-11-13</td>
                    <td className="px-4 py-2">
                        <span className="badge bg-[#236192] text-white py-1 px-2 rounded">Resolved</span>
                    </td>
                    <td className="px-4 py-2 text-[#236192]">Low</td>
                </tr>
                <tr className="hover:bg-[#236192]/10">
                    <td className="px-4 py-2">
                        <span className="whitespace-nowrap">Server Overload</span>
                    </td>
                    <td className="px-4 py-2">2024-11-10</td>
                    <td className="px-4 py-2">2024-11-14</td>
                    <td className="px-4 py-2">
                        <span className="badge bg-[#772583] text-white py-1 px-2 rounded">Monitoring</span>
                    </td>
                    <td className="px-4 py-2 text-[#772583]">Medium</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Multiple File</h5>
                            <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code2')}>
                                <span className="flex items-center">
                                    <IconCode className="me-2" />
                                    Code
                                </span>
                            </button>
                        </div>
                        
      {/* Modal for Adding Widget */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Add Widget" style={{ content: { width: '50%', margin: 'auto', height: 'auto' } }}>
        <h2 className="text-xl font-semibold mb-4">Add Widget</h2>
        <label className="font-semibold">Widget Title:</label>
        <input
          type="text"
          value={widgetTitle}
          onChange={(e) => setWidgetTitle(e.target.value)}
          className="p-2 border rounded-lg w-full mb-4"
        />
        <label className="font-semibold">Widget Description:</label>
        <textarea
          value={widgetDescription}
          onChange={(e) => setWidgetDescription(e.target.value)}
          className="p-2 border rounded-lg w-full mb-4"
        />
        <label className="font-semibold">Widget Type:</label>
        <Select
          options={widgetTypes}
          value={selectedWidgetType}
          onChange={setSelectedWidgetType}
          className="mb-4"
        />

        {/* Conditional UI based on selected widget type */}
        {selectedWidgetType.value === 'chart' && (
          <>
            <label className="font-semibold">Chart Type:</label>
            <Select
              options={chartTypes}
              value={chartType}
              onChange={setChartType}
              className="mb-4"
            />
          </>
        )}

        {selectedWidgetType.value === 'table' && (
          <>
            <label className="font-semibold">Table Rows:</label>
            {tableData.map((row, index) => (
              <div key={index} className="flex space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={row.name}
                  onChange={(e) => handleTableRowChange(index, 'name', e.target.value)}
                  className="p-2 border rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={row.value}
                  onChange={(e) => handleTableRowChange(index, 'value', e.target.value)}
                  className="p-2 border rounded-lg w-full"
                />
              </div>
            ))}
            <button onClick={addTableRow} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Add Row</button>
          </>
        )}

        {selectedWidgetType.value === 'summary' && (
          <>
            <label className="font-semibold">Summary Text:</label>
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="p-2 border rounded-lg w-full mb-4"
            />
          </>
        )}

        <label className="font-semibold">Widget Width (1-12):</label>
        <input
          type="number"
          value={modalWidth}
          onChange={(e) => setModalWidth(Number(e.target.value))}
          className="p-2 border rounded-lg w-full mb-4"
        />
        <label className="font-semibold">Widget Height (in rows):</label>
        <input
          type="number"
          value={modalHeight}
          onChange={(e) => setModalHeight(Number(e.target.value))}
          className="p-2 border rounded-lg w-full mb-4"
        />
        <button onClick={addCustomContainer} className="bg-green-500 text-white px-4 py-2 rounded-lg">Add Widget</button>
        <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2">Cancel</button>
      </Modal>
    </div>
  );
};

export default Index;
