import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel, faFile } from '@fortawesome/free-solid-svg-icons'
import 'react-toastify/dist/ReactToastify.css';
import './GenerateReport.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

const GenerateReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reports?start=${startDate}&end=${endDate}`
      );
      setReportData(response.data);
      setIsReportGenerated(true);

      if (response.data.length === 0) {
        toast.info('No report data available', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Select Dates!', { autoClose: 3000 });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (reportData.length === 0) {
        toast.info('No report data available', { autoClose: 3000 });
        return;
      }

      const pdfData = generatePDFData(reportData);
      const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
      saveAs(pdfBlob, 'report.pdf');
    } catch (error) {
      toast.error('Error occurred while generating PDF', { autoClose: 3000 });
    }
  };

  const handleDownloadExcel = async () => {
    try {
      if (reportData.length === 0) {
        toast.info('No report data available', { autoClose: 3000 });
        return;
      }

      const excelData = generateExcelData(reportData);
      const excelFile = await generateExcelFile(excelData);
      saveAs(excelFile, 'report.xlsx');
    } catch (error) {
      toast.error('Error occurred while generating Excel', { autoClose: 3000 });
      console.error(error);
    }
  };

  const generatePDFData = (data) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Phone', 'Purpose of Visit', 'Check In', 'Check Out']],
      body: data.map((item) => [
        item.name,
        item.phone,
        item.purposeOfVisit,
        new Date(item.checkIn).toLocaleString(),
        new Date(item.checkOut).toLocaleString(),
      ]),
    });
    return doc.output('blob');
  };

  const generateExcelData = (data) => {
    return data.map((item) => ({
      Name: item.name,
      Phone: item.phone,
      'Purpose of Visit': item.purposeOfVisit,
      'Check In': new Date(item.checkIn).toLocaleString(),
      'Check Out': new Date(item.checkOut).toLocaleString(),
    }));
  };

  const generateExcelFile = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    const headerRow = worksheet.addRow(['Name', 'Phone', 'Purpose of Visit', 'Check In', 'Check Out']);
    headerRow.font = { bold: true };

    data.forEach((item) => {
      worksheet.addRow([
        item.Name,
        item.Phone,
        item['Purpose of Visit'],
        item['Check In'],
        item['Check Out'],
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  return (
    <div className="container-Report mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group-Report">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control-Report"
              id="start"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group-Report">
            <label>End Date:</label>
            <input
              type="date"
              className="form-control-Report"
              id="end"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button className="btn btn-primary-Report" onClick={handleGenerateReport}>
        <FontAwesomeIcon icon={faFile} /> Generate Report
      </button>
      {reportData.length > 0 ? (
        <div className="table-container">
          <table className="table mt-4">
            <thead>
              <tr>
                <th>NAME</th>
                <th>PHONE</th>
                <th>PURPOSE OF VISIT</th>
                <th>CHECK IN</th>
                <th>CHECK OUT</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((data) => (
                <tr key={data._id}>
                  <td>{data.name}</td>
                  <td>{data.phone}</td>
                  <td>{data.purposeOfVisit}</td>
                  <td>{new Date(data.checkIn).toLocaleString()}</td>
                  <td>{new Date(data.checkOut).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {isReportGenerated && reportData.length > 0 && (
        <div className="button-container">
          <button className="btn btn-secondary-PDF" onClick={handleDownloadPDF}>
            <FontAwesomeIcon icon={faFilePdf} /> Download PDF
          </button>
          <button className="btn btn-secondary-EXCEL" onClick={handleDownloadExcel}>
            <FontAwesomeIcon icon={faFileExcel} /> Download Excel
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default GenerateReport;