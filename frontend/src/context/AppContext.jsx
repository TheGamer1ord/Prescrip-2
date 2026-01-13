import { createContext, useState, useEffect } from "react";
import { doctors } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = "TK";
    
    // State to manage appointments
    const [appointments, setAppointments] = useState([]);
    
    // State to manage user profile
    const [userData, setUserData] = useState({
        name: '',
        image: '',
        email: '',
        phone: '',
        address: {
            line1: '',
            line2: '',
        },
        gender: '',
        dob: '',
    });
    
    // Load user data from localStorage and auth user info on initial render
    useEffect(() => {
        const savedUserData = localStorage.getItem('userData');
        const savedAuthUser = localStorage.getItem('user');

        setUserData(prev => {
            let next = { ...prev };

            if (savedUserData) {
                try {
                    next = { ...next, ...JSON.parse(savedUserData) };
                } catch (e) {
                    console.error('Failed to parse saved userData from localStorage', e);
                }
            }

            if (savedAuthUser) {
                try {
                    const authUser = JSON.parse(savedAuthUser);
                    next = {
                        ...next,
                        name: authUser.name || next.name,
                        email: authUser.email || next.email,
                    };
                } catch (e) {
                    console.error('Failed to parse auth user from localStorage', e);
                }
            }

            return next;
        });
    }, []);
    
    // Save user data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);
    
    // Function to update user profile
    const updateUserData = (newData) => {
        setUserData(prev => ({
            ...prev,
            ...newData
        }));
    };
    
    // Function to add a new appointment
    const addAppointment = (appointment) => {
        setAppointments(prev => [...prev, appointment]);
    };
    
    // Function to cancel an appointment
    const cancelAppointment = (appointmentId) => {
        setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    };
    
    const value = {
        doctors,
        currencySymbol,
        appointments,
        addAppointment,
        cancelAppointment,
        userData,
        updateUserData
    };
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;