import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { specialityData } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import apiClient from '../lib/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different facility types
const createFacilityIcon = (type) => {
  const iconColor = {
    'hospital': 'red',
    'clinic': 'blue',
    'community_clinic': 'green',
    'upazila_health_complex': 'orange',
    'union_health_center': 'purple'
  }[type] || 'blue';

  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Doctor icon (violet/purple color to distinguish from facilities)
const doctorIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map view changes when facilities are selected
function MapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

const Map = () => {
  const { doctors } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [area, setArea] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [doctorSpeciality, setDoctorSpeciality] = useState(''); // Separate filter for doctors
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.4607, 91.1809]); // Default: Cumilla center [lat, lng]
  const [mapZoom, setMapZoom] = useState(12);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger an API call to search for doctors
    console.log(`Searching for ${speciality} in ${area}`);
  };

  // Fetch all facilities from backend
  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/healthmap/facilities');
      const facilitiesData = response.data || [];
      setFacilities(facilitiesData);
      
      // If we have facilities, center map on them
      if (facilitiesData.length > 0) {
        // Calculate center of all facilities
        const coords = facilitiesData
          .filter(f => f.location && f.location.coordinates && f.location.coordinates.length === 2)
          .map(f => {
            const [lng, lat] = f.location.coordinates; // API returns [lng, lat]
            return [lat, lng]; // Leaflet needs [lat, lng]
          });
        
        if (coords.length > 0) {
          const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length;
          const avgLng = coords.reduce((sum, [, lng]) => sum + lng, 0) / coords.length;
          setMapCenter([avgLat, avgLng]);
          setMapZoom(7); // Zoom out to show all facilities
        }
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError('Connection timeout. Please check if the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in to view facilities.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check the backend configuration.');
      } else {
        setError(err.response?.data?.message || 'Failed to load facilities. Please check your connection and authentication.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch nearest facilities based on current location
  const fetchNearestFacilities = useCallback(async (location) => {
    setLoading(true);
    setError('');
    try {
      // API expects [longitude, latitude]
      const response = await apiClient.post('/healthmap/nearest', {
        location: [location.lng, location.lat],
        limit: 100, // Increase limit to show more facilities
        maxDistance: 50000 // 50km
      });
      setFacilities(response.data || []);
      
      // Center map on user location
      setMapCenter([location.lat, location.lng]);
      setMapZoom(12);
    } catch (err) {
      console.error('Error fetching nearest facilities:', err);
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError('Connection timeout. Please check if the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in to view facilities.');
      } else {
        setError(err.response?.data?.message || 'Failed to load nearby facilities.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle facility click - center map on facility
  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
    setSelectedDoctor(null);
    if (facility.location && facility.location.coordinates) {
      // Coordinates are [longitude, latitude] from backend
      const [lng, lat] = facility.location.coordinates;
      setMapCenter([lat, lng]); // Leaflet uses [lat, lng]
      setMapZoom(16); // Zoom in to facility
    }
  };

  // Handle doctor click - center map on doctor
  const handleDoctorClick = useCallback((doctor) => {
    setSelectedDoctor(doctor);
    setSelectedFacility(null);
    if (doctor.location && doctor.location.coordinates) {
      // Coordinates are [longitude, latitude]
      const [lng, lat] = doctor.location.coordinates;
      setMapCenter([lat, lng]); // Leaflet uses [lat, lng]
      setMapZoom(16); // Zoom in to doctor
    }
  }, []);

  // Handle marker click
  const handleMarkerClick = (facility) => {
    setSelectedFacility(facility);
    setSelectedDoctor(null);
  };

  // Handle doctor marker click
  const handleDoctorMarkerClick = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedFacility(null);
  };

  // Load facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  // Handle URL parameters for doctor selection
  useEffect(() => {
    const doctorSpecialityParam = searchParams.get('doctorSpeciality');
    const doctorIdParam = searchParams.get('doctorId');
    
    if (doctorSpecialityParam) {
      setDoctorSpeciality(doctorSpecialityParam);
    }
    
    if (doctorIdParam && doctors.length > 0) {
      const doctor = doctors.find(d => d._id === doctorIdParam);
      if (doctor) {
        handleDoctorClick(doctor);
        // Clear URL params after handling
        setSearchParams({});
      }
    }
  }, [searchParams, doctors, handleDoctorClick, setSearchParams]);

  // When user uses current location, fetch nearest facilities
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchNearestFacilities({ lat: latitude, lng: longitude });
      },
      () => {
        alert('Your location could not be found.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Filter facilities by area or speciality if needed
  const filteredFacilities = facilities.filter(facility => {
    if (area && !facility.address?.toLowerCase().includes(area.toLowerCase()) && 
        !facility.district?.toLowerCase().includes(area.toLowerCase()) &&
        !facility.upazila?.toLowerCase().includes(area.toLowerCase())) {
      return false;
    }
    if (speciality && facility.type !== speciality) {
      return false;
    }
    return true;
  });

  // Filter doctors by speciality
  const filteredDoctors = doctors.filter(doctor => {
    if (doctorSpeciality && doctor.speciality?.toLowerCase() !== doctorSpeciality.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Healthcare Facilities Map</h1>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search for Facilities & Doctors</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area/City</label>
            <input
              type="text"
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area or city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">Facility Type</label>
            <div className="relative">
              <select
                id="speciality"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">All Types</option>
                <option value="hospital">Hospital</option>
                <option value="clinic">Clinic</option>
                <option value="community_clinic">Community Clinic</option>
                <option value="upazila_health_complex">Upazila Health Complex</option>
                <option value="union_health_center">Union Health Center</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="doctorSpeciality" className="block text-sm font-medium text-gray-700 mb-1">Doctor Category</label>
            <div className="relative">
              <select
                id="doctorSpeciality"
                value={doctorSpeciality}
                onChange={(e) => setDoctorSpeciality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">All Doctors</option>
                <option value="neurologist">Neurologist</option>
                <option value="gynecologist">Gynecologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="pediatricians">Pediatricians</option>
                <option value="gastroenterologist">Gastroenterologist</option>
                <option value="physician">Physician</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button 
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
              title="Show facilities near my location"
            >
              📍
            </button>
          </div>
        </form>
      </div>

      {/* Map container */}
      <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden mb-8" style={{ height: '600px' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapView center={mapCenter} zoom={mapZoom} />
          
          {/* Markers for all facilities */}
          {filteredFacilities
            .filter(facility => facility.location && facility.location.coordinates && facility.location.coordinates.length === 2)
            .map((facility) => {
              const [lng, lat] = facility.location.coordinates; // API returns [lng, lat]
              const position = [lat, lng]; // Leaflet needs [lat, lng]
              
              return (
                <Marker
                  key={facility._id || facility.id}
                  position={position}
                  icon={createFacilityIcon(facility.type)}
                  eventHandlers={{
                    click: () => handleMarkerClick(facility),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-1">{facility.name}</h3>
                      <p className="text-sm text-gray-600 capitalize mb-1">
                        {facility.type?.replace(/_/g, ' ')}
                      </p>
                      {facility.address && (
                        <p className="text-sm text-gray-700 mb-1">📍 {facility.address}</p>
                      )}
                      {(facility.district || facility.upazila) && (
                        <p className="text-xs text-gray-500 mb-1">
                          {facility.district}{facility.upazila && `, ${facility.upazila}`}
                        </p>
                      )}
                      {facility.contact?.phone && (
                        <p className="text-sm text-blue-600 mb-1">📞 {facility.contact.phone}</p>
                      )}
                      {facility.distance && (
                        <p className="text-sm font-semibold text-green-600">
                          Distance: {Math.round(facility.distance)}m
                        </p>
                      )}
                      <button
                        onClick={() => handleFacilityClick(facility)}
                        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Markers for doctors */}
          {filteredDoctors
            .filter(doctor => doctor.location && doctor.location.coordinates && doctor.location.coordinates.length === 2)
            .map((doctor) => {
              const [lng, lat] = doctor.location.coordinates; // [lng, lat]
              const position = [lat, lng]; // Leaflet needs [lat, lng]
              
              return (
                <Marker
                  key={doctor._id}
                  position={position}
                  icon={doctorIcon}
                  eventHandlers={{
                    click: () => handleDoctorMarkerClick(doctor),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-1 text-violet-700">👨‍⚕️ {doctor.name}</h3>
                      <p className="text-sm text-gray-600 capitalize mb-1">
                        {doctor.speciality}
                      </p>
                      {doctor.degree && (
                        <p className="text-xs text-gray-500 mb-1">{doctor.degree}</p>
                      )}
                      {doctor.address && (
                        <p className="text-sm text-gray-700 mb-1">
                          📍 {doctor.address.line1}
                          {doctor.address.line2 && `, ${doctor.address.line2}`}
                        </p>
                      )}
                      {doctor.fees && (
                        <p className="text-sm font-semibold text-green-600 mb-1">
                          Fees: {doctor.fees} TK
                        </p>
                      )}
                      <button
                        onClick={() => handleDoctorClick(doctor)}
                        className="mt-2 text-xs bg-violet-500 text-white px-2 py-1 rounded hover:bg-violet-600"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-blue-600">{filteredFacilities.length}</span> facilities 
              and <span className="font-bold text-violet-600">{filteredDoctors.length}</span> doctors on the map
            </p>
          </div>
          <button
            onClick={fetchFacilities}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 text-sm"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh All'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Doctors in Cumilla ({filteredDoctors.length})</h2>
        </div>

        {filteredDoctors.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => handleDoctorClick(doctor)}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedDoctor?._id === doctor._id
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">👨‍⚕️ {doctor.name}</h3>
                    <p className="text-gray-600 capitalize">{doctor.speciality}</p>
                    {doctor.degree && (
                      <p className="text-gray-500 text-sm mt-1">{doctor.degree}</p>
                    )}
                    {doctor.address && (
                      <p className="text-gray-500 text-sm mt-1">
                        📍 {doctor.address.line1}
                        {doctor.address.line2 && `, ${doctor.address.line2}`}
                      </p>
                    )}
                    {doctor.fees && (
                      <p className="text-violet-600 text-sm mt-1 font-medium">
                        Fees: {doctor.fees} TK
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDoctorClick(doctor);
                      }}
                      className="mt-2 bg-violet-100 hover:bg-violet-200 text-violet-700 text-sm font-medium py-1 px-3 rounded transition duration-300"
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDoctors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No doctors found. Try adjusting your search filters.</p>
          </div>
        )}
      </div>

      {/* Healthcare Facilities List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Healthcare Facilities ({filteredFacilities.length})</h2>
        </div>

        {loading && facilities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading facilities...</p>
          </div>
        )}

        {!loading && filteredFacilities.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-500">No facilities found. Try adjusting your search filters or check your connection.</p>
          </div>
        )}

        {filteredFacilities.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredFacilities.map((facility) => (
              <div
                key={facility._id || facility.id}
                onClick={() => handleFacilityClick(facility)}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedFacility?._id === facility._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{facility.name}</h3>
                    <p className="text-gray-600 capitalize">{facility.type?.replace(/_/g, ' ')}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      📍 {facility.address}
                    </p>
                    {(facility.district || facility.upazila) && (
                      <p className="text-gray-500 text-sm">
                        {facility.district && `📍 ${facility.district}`}
                        {facility.upazila && `, ${facility.upazila}`}
                      </p>
                    )}
                    {facility.services && facility.services.length > 0 && (
                      <p className="text-gray-500 text-xs mt-1">
                        Services: {facility.services.slice(0, 3).join(', ')}
                        {facility.services.length > 3 && ` +${facility.services.length - 3} more`}
                      </p>
                    )}
                    {facility.contact?.phone && (
                      <p className="text-gray-500 text-sm mt-1">📞 {facility.contact.phone}</p>
                    )}
                    {facility.distance && (
                      <p className="text-blue-600 text-sm mt-1 font-medium">
                        Distance: {Math.round(facility.distance)}m
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    {facility.verified && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded mb-2">
                        ✓ Verified
                      </span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFacilityClick(facility);
                      }}
                      className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium py-1 px-3 rounded transition duration-300"
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Doctor Details */}
      {selectedDoctor && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Doctor Details</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900">👨‍⚕️ {selectedDoctor.name}</h3>
              <p className="text-gray-600 capitalize">{selectedDoctor.speciality}</p>
            </div>
            {selectedDoctor.degree && (
              <div>
                <p className="text-gray-700"><strong>Degree:</strong> {selectedDoctor.degree}</p>
              </div>
            )}
            {selectedDoctor.experience && (
              <div>
                <p className="text-gray-700"><strong>Experience:</strong> {selectedDoctor.experience}</p>
              </div>
            )}
            {selectedDoctor.address && (
              <div>
                <p className="text-gray-700">
                  <strong>Address:</strong> {selectedDoctor.address.line1}
                  {selectedDoctor.address.line2 && `, ${selectedDoctor.address.line2}`}
                </p>
              </div>
            )}
            {selectedDoctor.fees && (
              <div>
                <p className="text-gray-700"><strong>Consultation Fees:</strong> {selectedDoctor.fees} TK</p>
              </div>
            )}
            {selectedDoctor.about && (
              <div>
                <p className="text-gray-700"><strong>About:</strong> {selectedDoctor.about}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Facility Details */}
      {selectedFacility && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Facility Details</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{selectedFacility.name}</h3>
              <p className="text-gray-600 capitalize">{selectedFacility.type?.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-gray-700"><strong>Address:</strong> {selectedFacility.address}</p>
              {(selectedFacility.district || selectedFacility.upazila || selectedFacility.division) && (
                <p className="text-gray-700">
                  <strong>Location:</strong> {selectedFacility.district || ''}
                  {selectedFacility.upazila && `, ${selectedFacility.upazila}`}
                  {selectedFacility.division && `, ${selectedFacility.division}`}
                </p>
              )}
            </div>
            {selectedFacility.contact && (
              <div>
                {selectedFacility.contact.phone && (
                  <p className="text-gray-700"><strong>Phone:</strong> {selectedFacility.contact.phone}</p>
                )}
                {selectedFacility.contact.email && (
                  <p className="text-gray-700"><strong>Email:</strong> {selectedFacility.contact.email}</p>
                )}
              </div>
            )}
            {selectedFacility.services && selectedFacility.services.length > 0 && (
              <div>
                <p className="text-gray-700 font-medium mb-1">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFacility.services.map((service, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedFacility.operatingHours && (
              <p className="text-gray-700"><strong>Operating Hours:</strong> {selectedFacility.operatingHours}</p>
            )}
            {selectedFacility.accessibility && (
              <div>
                <p className="text-gray-700 font-medium mb-1">Accessibility:</p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  {selectedFacility.accessibility.roadAccess && <li>Road Access Available</li>}
                  {selectedFacility.accessibility.publicTransport && <li>Public Transport Available</li>}
                  {selectedFacility.accessibility.transportOptions && selectedFacility.accessibility.transportOptions.length > 0 && (
                    <li>Transport: {selectedFacility.accessibility.transportOptions.join(', ')}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
