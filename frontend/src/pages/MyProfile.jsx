import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const MyProfile = () => {
  const { userData, updateUserData } = useContext(AppContext);
  
  // Local state for form data during editing
  const [formData, setFormData] = useState({ 
    ...userData,
    address: userData.address || { line1: '', line2: '' }
  });
  
  // State to control the edit mode (true = editing, false = viewing)
  const [isEdit, setIsEdit] = useState(false);
  
  // Update form data when user data changes
  useEffect(() => {
    setFormData({ 
      ...userData,
      address: userData.address || { line1: '', line2: '' }
    });
  }, [userData]);

  // Function to handle changes in input fields
  const handleInputChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Function to handle address changes
  const handleAddressChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...(prev.address || { line1: '', line2: '' }),
        [field]: e.target.value
      }
    }));
  };

  // Function to handle gender selection
  const handleGenderChange = (e) => {
    setFormData(prev => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  // Function to handle date of birth change
  const handleDOBChange = (e) => {
    setFormData(prev => ({
      ...prev,
      dob: e.target.value,
    }));
  };

  // Function to handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to save profile changes
  const saveProfile = () => {
    updateUserData(formData);
    setIsEdit(false);
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setFormData({ ...userData }); // Reset form data to current user data
    setIsEdit(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 bg-gray-50">
              <img 
                src={formData.image || assets.upload_area} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <label className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer text-sm">
              <img src={assets.upload_icon} alt="Upload" className="w-4 h-4" />
              <span>Edit photo</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Profile Information Section */}
          <div className="flex-1">
            {/* Name Section */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              {isEdit ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 text-lg">{formData.name}</p>
              )}
            </div>

            <hr className="my-6" />

            {/* Contact Information Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email ID</label>
                  <p className="text-gray-800">{formData.email}</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    {!isEdit && (
                      <button
                        type="button"
                        onClick={() => setIsEdit(true)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEdit ? (
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange(e, 'phone')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800 min-h-[1.5rem]">
                      {formData.phone || ''}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address Line 1</label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={formData.address?.line1 || ''}
                      onChange={(e) => handleAddressChange(e, 'line1')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.address?.line1 || ''}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address Line 2</label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={formData.address?.line2 || ''}
                      onChange={(e) => handleAddressChange(e, 'line2')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.address?.line2 || ''}</p>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-6" />

            {/* Basic Information Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setIsEdit(true)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  {isEdit ? (
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleGenderChange}
                      value={formData.gender || ''}
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 min-h-[1.5rem]">
                      {formData.gender || ''}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Birthday</label>
                  {isEdit ? (
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="date"
                      onChange={handleDOBChange}
                      value={formData.dob || ''}
                    />
                  ) : (
                    <p className="text-gray-800 min-h-[1.5rem]">
                      {formData.dob ? (() => {
                        try {
                          const date = new Date(formData.dob);
                          return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
                        } catch {
                          return '';
                        }
                      })() : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEdit && (
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={cancelEdit}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;