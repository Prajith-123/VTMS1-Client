import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManageRecord.css';

console.error = (message) => {
  if (typeof message === 'string' && message.startsWith('Warning: A component is changing an uncontrolled input')) {
    return;
  }
  throw new Error(message);
};

const purposeOptions = [
  { value: 'Regarding Admissions', label: 'Regarding Admissions' },
  { value: 'Campus Tours', label: 'Campus Tours' },
  { value: 'Recruitment', label: 'Recruitment' },
  { value: 'Alumni Engagement/Interaction', label: 'Alumni Engagement/Interaction' },
  { value: 'Research Collaborations', label: 'Research Collaborations' },
  { value: 'Internship or Job Shadowing', label: 'Internship or Job Shadowing' },
  { value: 'Campus Safety and Security', label: 'Campus Safety and Security' },
  { value: 'To Attend College', label: 'To Attend College' },
  { value: 'Special Events', label: 'Special Events' },
  { value: 'Lectures and Presentations', label: 'Lectures and Presentations' },
];

const vehicleTypeOptions = [
  { value: 'N/A', label: 'N/A' },
  { value: 'Car', label: 'Car' },
  { value: 'College Bus', label: 'College Bus' },
  { value: 'Motorcycle', label: 'Motorcycle' },
  { value: 'Bicycle', label: 'Bicycle' },
  { value: 'Scooty', label: 'Scooty' },
  { value: 'Van or Minivan', label: 'Van or Minivans' },
  { value: 'SUVs or Crossovers', label: 'SUVs or Crossovers' },
];


const ManageRecords = () => {
  const [visitors, setVisitors] = useState([]);
  const [editVisitor, setEditVisitor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    proofId: '',
    vehicleType: '',
    vehicleNumber: '',
    purposeOfVisit: '',
    photo: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [showTextField, setShowTextField] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/visitors');
      setVisitors(response.data);
    } catch (error) {
      toast.error('Error occurred while fetching visitors');
    }
  };

  const handleCheckOut = async (visitorId) => {
    try {
      await axios.put(`http://localhost:5000/api/visitors/${visitorId}/checkout`);
      fetchVisitors();
      toast.success('Visitor Checkout successful');
    } catch (error) {
      toast.error('Error occurred while checking out visitor');
    }
  };

  const handleDelete = async (visitorId) => {
    try {
      await axios.delete(`http://localhost:5000/api/visitors/${visitorId}`);
      fetchVisitors();
      toast.success('Visitor deleted successfully');
    } catch (error) {
      toast.error('Error occurred while deleting visitor');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'photo') {
      setSelectedFile(e.target.files[0]);
    } else if (name === 'vehicleType') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        vehicleType: value,
        vehicleNumber: value === 'N/A' || value === 'Bicycle' ? 'N/A' : '',
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: name === 'purposeOfVisit' ? value : value || '',
      }));
    }
  };

  const handleIdChange = (e) => {
    const selectedId = e.target.value;
    setSelectedId(selectedId);
    setShowTextField(selectedId === 'id1' || selectedId === 'id2' || selectedId === 'id3');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const visitorId = editVisitor._id;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);
        await axios.put(`http://localhost:5000/api/visitors/${visitorId}/photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await axios.put(`http://localhost:5000/api/visitors/${visitorId}`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        proofId: formData.proofId,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        purposeOfVisit: formData.purposeOfVisit,
      });
      fetchVisitors();
      setEditVisitor(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        proofId: '',
        vehicleType: '',
        vehicleNumber: '',
        purposeOfVisit: '',
        photo: '',
      });
      setSelectedFile(null);
      toast.success('Visitor updated successfully');
    } catch (error) {
      toast.error('Error occurred while updating visitor');
    }
  };

  const openModal = (visitorId) => {
    const visitorToUpdate = visitors.find((visitor) => visitor._id === visitorId);
    if (visitorToUpdate) {
      setEditVisitor(visitorToUpdate);
      setFormData({
        name: visitorToUpdate.name,
        phone: visitorToUpdate.phone,
        email: visitorToUpdate.email,
        proofId: visitorToUpdate.proofId,
        vehicleType: visitorToUpdate.vehicleType,
        vehicleNumber: visitorToUpdate.vehicleNumber,
        purposeOfVisit: visitorToUpdate.purposeOfVisit || '',
        photo: visitorToUpdate.photo,
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditVisitor(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      proofId: '',
      vehicleType: '',
      vehicleNumber: '',
      purposeOfVisit: '',
      photo: '',
    });
  };

  const getFileName = (path) => {
    if (path) {
      const fileName = path.split('\\').pop(); // Extract the file name from the path
      const startIndex = fileName.indexOf('-') + 1; // Find the index of the first occurrence of "-"
      return fileName.substring(startIndex); // Return the substring starting from the index after "-"
    }
    return '';
  };

  return (
    <div className="container Record">
      <ToastContainer />
      {editVisitor && (
        <div className={`modal ${isModalOpen ? 'show' : ''}`}>
          <div className="modal-content">
            <h4>Edit Visitor</h4>
            <form onSubmit={handleSubmit}>
              <div className="Record form-row">
                <div className="Record form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="Record form-group">
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="Record form-row">
                <div className="Record form-group">
                  <label>Email:</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="Record form-group">
                  <label>ID:</label>
                  <select
                    value={selectedId}
                    onChange={handleIdChange}
                  >
                    <option value="">Select an ID</option>
                    <option value="id1">Adhaar Card</option>
                    <option value="id2">Voter ID</option>
                    <option value="id3">Student ID</option>
                  </select>
                </div>
              </div>
              {showTextField && (
                <div className="Record form-group">
                  <label> Enter {selectedId === 'id1' ? 'Adhaar' : selectedId === 'id2' ? 'Voter' : 'Student'} ID</label>
                  <input
                    type="text"
                    name="proofId"
                    value={formData.proofId}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className="Record form-row">
                <div className="Record form-group">
                  <label>Vehicle Type:</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Record form-group">
                  <label>Vehicle Number:</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="Record form-group">
                <label>Purpose of Visit:</label>
                <select
                  name="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleChange}
                >
                  <option value="">Update Purpose</option>
                  {purposeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="Record form-group">
                <label>Photo:</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  accept="image/*"
                  required={!editVisitor && !selectedFile}
                />
                {editVisitor && !selectedFile && <img src={formData.photo} alt="" height="50" />}
              </div>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>PHONE</th>
              <th>EMAIL</th>
              <th>ID</th>
              <th>VEHICLE TYPE</th>
              <th>VEHICLE NUMBER</th>
              <th>PURPOSE OF VISIT</th>
              <th>PHOTO</th>
              <th>CHECK IN</th>
              <th>CHECK OUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor._id}>
                <td>{visitor.name}</td>
                <td>{visitor.phone}</td>
                <td>{visitor.email}</td>
                <td>{visitor.proofId}</td>
                <td>{visitor.vehicleType}</td>
                <td>{visitor.vehicleNumber}</td>
                <td>{visitor.purposeOfVisit}</td>
                <td>{getFileName(visitor.photo)}</td>
                <td>{visitor.checkIn ? new Date(visitor.checkIn).toLocaleString() : ''}</td>
                <td>{visitor.checkOut ? new Date(visitor.checkOut).toLocaleString() : ''}</td>
                <td>
                  <div className="button-group">
                    {!visitor.checkOut && (
                      <button
                        className="btn btn-info btn-equal-size"
                        onClick={() => handleCheckOut(visitor._id)}
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-equal-size"
                      onClick={() => handleDelete(visitor._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="btn btn-secondary btn-equal-size"
                      onClick={() => openModal(visitor._id)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRecords;