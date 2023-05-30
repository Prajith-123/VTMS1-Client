import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from 'react-webcam';
import './AddVisitor.css';

// Helper function to convert a base64 data URI to a Blob object
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

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

const AddVisitor = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [proofId, setproofId] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [showTextField, setShowTextField] = useState(false);

  const webcamRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email || !proofId || !vehicleType || !vehicleNumber || !purposeOfVisit || !photo) {
      toast.error('Please fill out all the fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('proofId', selectedId);
    formData.append('vehicleType', vehicleType);
    formData.append('vehicleNumber', vehicleNumber);
    formData.append('purposeOfVisit', purposeOfVisit);
    formData.append('photo', photo);

    try {
      await axios.post('http://localhost:5000/api/visitors/add-visitor', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Visitor added successfully');
      setName('');
      setPhone('');
      setEmail('');
      setproofId('');
      setSelectedId('');
      setVehicleType('');
      setVehicleNumber('');
      setPurposeOfVisit('');
      setPhoto(null);
      setFileName('');
    } catch (error) {
      toast.error('Please Fill up the Form');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Convert the base64 image to a Blob object
    const blobImage = dataURItoBlob(imageSrc);
    // Create a new File object with the Blob and a random filename
    const file = new File([blobImage], `${name.split(' ')[0]}.jpg`, { type: 'image/jpeg' });
    setPhoto(file);
    setFileName(file.name);
    closeCamera();

    const fileInput = document.querySelector('.form-control-New[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleVehicleTypeChange = (e) => {
    const selectedType = e.target.value;
    setVehicleType(selectedType);

    if (selectedType === 'N/A') {
      setVehicleNumber('N/A');
    }
  };

  return (
    <div className="container-New">
      <ToastContainer />

      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control-New"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control-New"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control-New"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>ID</label>
              <select
                className="form-control-New"
                value={proofId}
                onChange={(e) => {
                  setproofId(e.target.value);
                  setSelectedId(e.target.value);
                  setShowTextField(true);
                }}
              >
                <option value="">Select an ID</option>
                <option value="id1">Adhaar Card</option>
                <option value="id2">Voter ID</option>
                <option value="id3">Student ID</option>
              </select>
            </div>
            {showTextField && (
              <div className="form-group">
                <label>Enter {selectedId === 'id1' ? 'Adhaar' : selectedId === 'id2' ? 'Voter' : 'Student'} ID</label>
                <input
                  type="text"
                  className="form-control-New"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Vehicle Type</label>
              <select
                className="form-control-New"
                value={vehicleType}
                onChange={handleVehicleTypeChange}
              >
                <option value="">Select a vehicle type</option>
                {vehicleTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Vehicle Number</label>
              <input
                type="text"
                className="form-control-New"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Purpose of Visit</label>
            <select
              className="form-control-New"
              value={purposeOfVisit}
              onChange={(e) => setPurposeOfVisit(e.target.value)}
            >
              <option value="">Select purpose of visit</option>
              {purposeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Photo</label>
            <div className="photo-input">
              <div className="photo-input-container">
                <input
                  type="file"
                  className="form-control-New"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button type="button" className="btn btn-open-camera" onClick={openCamera}>
                  Camera
                </button>
              </div>
              {fileName && <div className='fileName'>File name: {fileName}</div>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary-New">
            Add Visitor
          </button>
        </form>
      </div>
      {showCamera && (
        <div className="webcam-container">
          <div className="webcam-box">
            <Webcam
              className="webcam"
              audio={false}
              ref={webcamRef}
              screenshotFormat={'image/jpeg'}
            />
            <div className="webcam-controls">
              <button className="btn btn-primary-New" onClick={captureImage}>
                Capture
              </button>
              <button className="btn btn-primary-New" onClick={closeCamera}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVisitor;