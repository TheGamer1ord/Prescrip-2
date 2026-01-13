import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { appointments, cancelAppointment } = useContext(AppContext);

  // Function to format date
  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Function to handle appointment cancellation
  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment(appointmentId);
      alert("Appointment cancelled successfully");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You don't have any appointments yet.</p>
          <button 
            onClick={() => window.location.href = '/doctor'}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition duration-300"
          >
            Book an Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full overflow-hidden">
                    {appointment.doctor.image ? (
                      <img 
                        src={appointment.doctor.image} 
                        alt={appointment.doctor.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">{appointment.doctor.name}</h3>
                    <p className="text-sm text-gray-600">{appointment.doctor.speciality}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(appointment.dateTime)} at {appointment.time}
                    </p>
                  </div>
                </div>
                
                {/* Appointment Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="text-sm text-blue-600 border border-blue-600 hover:bg-blue-50 py-2 px-4 rounded-full transition duration-300">
                    Play Online
                  </button>
                  <button 
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="text-sm text-red-600 border border-red-600 hover:bg-red-50 py-2 px-4 rounded-full transition duration-300"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;