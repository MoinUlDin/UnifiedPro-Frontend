import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';

import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconCoffee from '../../components/Icon/IconCoffee';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconMail from '../../components/Icon/IconMail';
import IconPhone from '../../components/Icon/IconPhone';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconDribbble from '../../components/Icon/IconDribbble';
import IconGithub from '../../components/Icon/IconGithub';
import IconShoppingBag from '../../components/Icon/IconShoppingBag';
import IconTag from '../../components/Icon/IconTag';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconClock from '../../components/Icon/IconClock';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import ReactApexChart from 'react-apexcharts';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';
import IconPlus from '../../components/Icon/IconPlus';

const Profile = () => {
    const totalVisit: any = {
        series: [{ data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25] }],
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
    };
    // paidVisitOptions
    const paidVisit: any = {
        series: [{ data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69] }],
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
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });
    const isRtl = useSelector((state: RootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse"></ul>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="panel h-full sm:col-span-2 lg:col-span-1">
                    {/* statistics */}
                    <div className="flex justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg ">Statistics</h5>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
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
                    <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                        <div>
                            <div>
                                <div>Allowed Late Minutes</div>
                                <div className="text-[#f8538d] text-lg">100</div>
                            </div>

                            <ReactApexChart series={totalVisit.series} options={totalVisit.options} type="line" height={58} className="overflow-hidden" />
                        </div>

                        <div>
                            <div>
                                <div>Clock In Time</div>
                                <div className="text-[#f8538d] text-lg">7:29 AM</div>
                            </div>

                            <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                        </div>
                        <div>
                            <div>
                                <div>Clock Out Time</div>
                                <div className="text-[#f8538d] text-lg">12:29 AM</div>
                                <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>Total Late Minutes</div>
                                <div className="text-[#f8538d] text-lg">121</div>
                            </div>

                            <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                        </div>
                    </div>
                </div>

                <div className="panel h-full">
                    <div className="flex justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg ">Overall Monthly Performance</h5>

                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
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
                    <div className=" text-[#e95f2b] text-2xl font-bold my-10">
                        <span>90% </span>
                        <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                        <IconTrendingUp className="text-success inline" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                            <div
                                className="bg-gradient-to-r from-[#4361ee] to-[#805dca] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                        <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">57%</span>
                    </div>
                    <div className="flex justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg ">Attendance %</h5>

                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
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
                    <div className=" text-[#e95f2b] text-2xl font-bold my-10">
                        <span>95% </span>
                        <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                        <IconTrendingUp className="text-success inline" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                            <div
                                className="bg-gradient-to-r from-[#4361ee] to-[#805dca] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                        <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">57%</span>
                    </div>
                </div>

                <div className="panel h-full sm:col-span-2 lg:col-span-1">
                    {/* statistics */}
                    <div className="flex justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg ">Statistics</h5>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
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
                    <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                        <div>
                            <div>
                                <div>Total Task</div>
                                <div className="text-[#f8538d] text-lg">100</div>
                            </div>

                            <ReactApexChart series={totalVisit.series} options={totalVisit.options} type="line" height={58} className="overflow-hidden" />
                        </div>

                        <div>
                            <div>
                                <div>Pending Tasks</div>
                                <div className="text-[#f8538d] text-lg">7</div>
                            </div>

                            <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                        </div>
                        <div>
                            <div>
                                <div>Completed Tasks</div>
                                <div className="text-[#f8538d] text-lg">93</div>
                                <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>Task Performance</div>
                                <div className="text-[#f8538d] text-lg">97%</div>
                            </div>

                            <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                            <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                                <IconPencilPaper />
                            </Link>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col justify-center items-center">
                                <img src="/assets/images/profile-34.jpeg" alt="img" className="w-24 h-24 rounded-full object-cover  mb-5" />
                                <p className="font-semibold text-primary text-xl">Jimmy Turner</p>
                            </div>
                            <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">
                                    <IconCoffee className="shrink-0" />
                                    Web Developer
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCalendar className="shrink-0" />
                                    Jan 20, 1989
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconMapPin className="shrink-0" />
                                    New York, USA
                                </li>
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconMail className="w-5 h-5 shrink-0" />
                                        <span className="text-primary truncate">jimmy@gmail.com</span>
                                    </button>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span className="whitespace-nowrap" dir="ltr">
                                        +1 (530) 555-12121
                                    </span>
                                </li>
                            </ul>
                            <ul className="mt-7 flex items-center justify-center gap-2">
                                <li>
                                    <button className="btn btn-info flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconTwitter className="w-5 h-5" />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-danger flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconDribbble />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-dark flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconGithub />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Task</h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                <table className="whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Projects</th>
                                            <th>Progress</th>
                                            <th>Task Done</th>
                                            <th className="text-center">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-white-dark">
                                        <tr>
                                            <td>Figma Design</td>
                                            <td>
                                                <div className="h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full">
                                                    <div className="bg-danger rounded-full w-[29.56%]"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">29.56%</td>
                                            <td className="text-center">2 mins ago</td>
                                        </tr>
                                        <tr>
                                            <td>Vue Migration</td>
                                            <td>
                                                <div className="h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full">
                                                    <div className="bg-info rounded-full w-1/2"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">50%</td>
                                            <td className="text-center">4 hrs ago</td>
                                        </tr>
                                        <tr>
                                            <td>Flutter App</td>
                                            <td>
                                                <div className="h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full">
                                                    <div className="bg-warning rounded-full  w-[39%]"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">39%</td>
                                            <td className="text-center">a min ago</td>
                                        </tr>
                                        <tr>
                                            <td>API Integration</td>
                                            <td>
                                                <div className="h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full">
                                                    <div className="bg-success rounded-full  w-[78.03%]"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">78.03%</td>
                                            <td className="text-center">2 weeks ago</td>
                                        </tr>

                                        <tr>
                                            <td>Blog Update</td>
                                            <td>
                                                <div className="h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full">
                                                    <div className="bg-secondary  rounded-full  w-full"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">100%</td>
                                            <td className="text-center">18 hrs ago</td>
                                        </tr>
                                        <tr>
                                            <td>Landing Page</td>
                                            <td>
                                                <div className="h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full">
                                                    <div className="bg-danger rounded-full  w-[19.15%]"></div>
                                                </div>
                                            </td>
                                            <td className="text-danger">19.15%</td>
                                            <td className="text-center">5 days ago</td>
                                        </tr>
                                        <tr>
                                            <td>Shopify Dev</td>
                                            <td>
                                                <div className="h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full">
                                                    <div className="bg-primary rounded-full w-[60.55%]"></div>
                                                </div>
                                            </td>
                                            <td className="text-success">60.55%</td>
                                            <td className="text-center">8 days ago</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-bold">Work Statement</div>
                            </div>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:opacity-80"
                                    button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="relative mt-10">
                            <div className="absolute -bottom-12 ltr:-right-12 rtl:-left-12 w-24 h-24">
                                <IconCircleCheck className="text-success opacity-20 w-full h-full" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="text-primary">Work Duration</div>
                                    <div className="mt-2 font-semibold text-2xl">434</div>
                                </div>
                                <div>
                                    <div className="text-primary">Manager points</div>
                                    <div className="mt-2 font-semibold text-2xl">$15,000.00</div>
                                </div>
                                <div>
                                    <div className="text-primary">360 Points</div>
                                    <div className="mt-2 font-semibold text-2xl">32</div>
                                </div>
                            </div>
                        </div>
                    </div>{' '}
                    <div className="panel lg:col-span-2 xl:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-bold">Attandance Statement</div>
                            </div>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:opacity-80"
                                    button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="relative mt-10">
                            <div className="absolute -bottom-12 ltr:-right-12 rtl:-left-12 w-24 h-24">
                                <IconCircleCheck className="text-success opacity-20 w-full h-full" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="text-primary">Total Working Days</div>
                                    <div className="mt-2 font-semibold text-2xl">56</div>
                                </div>
                                <div>
                                    <div className="text-primary">Total Present Days</div>
                                    <div className="mt-2 font-semibold text-2xl">54</div>
                                </div>
                                <div>
                                    <div className="text-primary">Total Absent Days</div>
                                    <div className="mt-2 font-semibold text-2xl">2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-4">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Training</h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                <table className="whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Training Title</th>
                                            <th>Assigned To</th>
                                            <th>Assigned By</th>
                                            <th>Assigned At</th>
                                            <th>Department</th>
                                            <th>Completed</th>
                                            <th>Watched</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-white-dark">
                                        <tr>
                                            <td className="font-semibold">UI/UX Design Basics</td>
                                            <td>John Doe</td>
                                            <td>Emma Wilson</td>
                                            <td>Jan 05, 2024</td>
                                            <td>Design</td>
                                            <td>85%</td>
                                            <td className="text-center">Yes</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">JavaScript Essentials</td>
                                            <td>Jane Smith</td>
                                            <td>Michael Johnson</td>
                                            <td>Feb 12, 2024</td>
                                            <td>Development</td>
                                            <td>70%</td>
                                            <td className="text-center">No</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">React Advanced</td>
                                            <td>Robert Brown</td>
                                            <td>Sophie Davis</td>
                                            <td>March 18, 2024</td>
                                            <td>Development</td>
                                            <td>90%</td>
                                            <td className="text-center">Yes</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Project Management</td>
                                            <td>Emma Wilson</td>
                                            <td>John Doe</td>
                                            <td>April 22, 2024</td>
                                            <td>Management</td>
                                            <td>80%</td>
                                            <td className="text-center">No</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Machine Learning Basics</td>
                                            <td>Michael Johnson</td>
                                            <td>Jane Smith</td>
                                            <td>May 10, 2024</td>
                                            <td>Data Science</td>
                                            <td>60%</td>
                                            <td className="text-center">Yes</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Agile Methodology</td>
                                            <td>Sophie Davis</td>
                                            <td>Robert Brown</td>
                                            <td>June 25, 2024</td>
                                            <td>Project Management</td>
                                            <td>95%</td>
                                            <td className="text-center">Yes</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Cloud Computing</td>
                                            <td>John Doe</td>
                                            <td>Emma Wilson</td>
                                            <td>July 30, 2024</td>
                                            <td>IT</td>
                                            <td>75%</td>
                                            <td className="text-center">No</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-2">
                        <div className="mb-5 text-lg font-bold">360 Evaluation</div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Form Name</th>
                                        <th>Created At</th>
                                        <th>Total Count</th>
                                        <th>Resend Count</th>
                                        <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="font-semibold">Form 1</td>
                                        <td className="whitespace-nowrap">Oct 08, 2021</td>
                                        <td>50</td>
                                        <td>5</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Form 2</td>
                                        <td className="whitespace-nowrap">Dec 18, 2021</td>
                                        <td>30</td>
                                        <td>3</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Form 3</td>
                                        <td className="whitespace-nowrap">Dec 25, 2021</td>
                                        <td>40</td>
                                        <td>7</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Form 4</td>
                                        <td className="whitespace-nowrap">Nov 29, 2021</td>
                                        <td>60</td>
                                        <td>2</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Form 5</td>
                                        <td className="whitespace-nowrap">Nov 24, 2021</td>
                                        <td>45</td>
                                        <td>8</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Form 6</td>
                                        <td className="whitespace-nowrap">Jan 26, 2022</td>
                                        <td>20</td>
                                        <td>1</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="panel lg:col-span-2 xl:col-span-2">
                        <div className="mb-5 text-lg font-bold">Self Evaluation</div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Employee</th>
                                        <th>Department</th>
                                        <th>Designation</th>
                                        <th>Total Forms</th>
                                        <th>Submitted Forms</th>
                                        <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">View Submissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="font-semibold">John Doe</td>
                                        <td className="whitespace-nowrap">HR</td>
                                        <td className="whitespace-nowrap">Manager</td>
                                        <td>10</td>
                                        <td>8</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Jane Smith</td>
                                        <td className="whitespace-nowrap">Finance</td>
                                        <td className="whitespace-nowrap">Accountant</td>
                                        <td>8</td>
                                        <td>5</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Robert Brown</td>
                                        <td className="whitespace-nowrap">IT</td>
                                        <td className="whitespace-nowrap">Developer</td>
                                        <td>12</td>
                                        <td>12</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Emma Wilson</td>
                                        <td className="whitespace-nowrap">Marketing</td>
                                        <td className="whitespace-nowrap">Coordinator</td>
                                        <td>7</td>
                                        <td>6</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Michael Johnson</td>
                                        <td className="whitespace-nowrap">Sales</td>
                                        <td className="whitespace-nowrap">Sales Rep</td>
                                        <td>9</td>
                                        <td>7</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Sophie Davis</td>
                                        <td className="whitespace-nowrap">Support</td>
                                        <td className="whitespace-nowrap">Support Agent</td>
                                        <td>5</td>
                                        <td>4</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary">View</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Minutes of Meetings */}
                    <div className="panel lg:col-span-2 xl:col-span-4">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Minutes of Meetings</h5>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Meeting Title</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Created At</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Minutes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 px-4">No minutes available.</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Expense Claims */}
                    <div className="panel lg:col-span-2 xl:col-span-4">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Expense Claims</h5>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Claim Date</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Description</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Amount</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">File</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Approved</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Rejected</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Rejection Reason</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Approval Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 px-4">No expense claims available.</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Leave Requests */}
                    <div className="panel lg:col-span-2 xl:col-span-4">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Leave Requests</h5>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Leave Type</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Start Date</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">End Date</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Approved</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Rejected</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Rejection Reason</th>
                                        <th className="py-2 px-4 text-sm text-[#515365] dark:text-white-dark">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                        <td className="py-2 px-4">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
