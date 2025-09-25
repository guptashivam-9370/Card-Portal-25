"use client";
import React, { useEffect, useState } from 'react';
import Loading from '../loading';

const Invoice = ({ transactionId }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch('https://cardsapi.alcheringa.in/api/invoice/generate/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch invoice data');
        }
        
        const data = await response.json();
        setInvoiceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!invoiceData) return <div className="p-4">No invoice data found</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-8">
        <div className="text-right">
          <p className="text-xl font-bold text-red-600 mb-2">INVOICE</p>
          <p className="text-sm">Transaction ID: {invoiceData.invoice_details.transaction_id}</p>
          <p className="text-sm">Date: {invoiceData.invoice_details.date}</p>
          <p className="text-sm">Status: {invoiceData.invoice_details.status}</p>
          {/* <p className="text-sm">Payment Mode: {invoiceData.invoice_details.payment_mode}</p> */}
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-8 border-b pb-4">
        <h3 className="font-bold mb-4">Attendee Details</h3>
        {invoiceData.attendees.map((attendee, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm"><span className="font-medium">Name:</span> {attendee.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {attendee.email}</p>
              <p className="text-sm"><span className="font-medium">Contact:</span> {attendee.contact}</p>
              <p className="text-sm"><span className="font-medium">Age:</span> {attendee.age}</p>
            </div>
            <div>
              <p className="text-sm"><span className="font-medium">Pass Type:</span> {attendee.pass_type}</p>
              <p className="text-sm"><span className="font-medium">Gender:</span> {attendee.gender}</p>
              <p className="text-sm"><span className="font-medium">ID Type:</span> {attendee.id_type}</p>
              <p className="text-sm"><span className="font-medium">ID Number:</span> {attendee.id_number}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Summary */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Pass Type</th>
              <th className="border p-2 text-center">Quantity</th>
              <th className="border p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.summary.normal_passes > 0 && (
              <tr>
                <td className="border p-2">Normal Passes</td>
                <td className="border p-2 text-center">{invoiceData.summary.normal_passes}</td>
                <td className="border p-2 text-right">
                  ₹{(invoiceData.summary.normal_passes * 250).toFixed(2)}
                </td>
              </tr>
            )}
            {invoiceData.summary.early_passes > 0 && (
              <tr>
                <td className="border p-2">Early Passes</td>
                <td className="border p-2 text-center">{invoiceData.summary.early_passes}</td>
                <td className="border p-2 text-right">
                  ₹{(invoiceData.summary.early_passes * 300).toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="border p-2" colSpan="2">Total Amount</td>
              <td className="border p-2 text-right">
                ₹{invoiceData.invoice_details.total_amount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm mb-2"><span className="font-medium">Total Attendees:</span> {invoiceData.summary.total_attendees}</p>
        <p className="text-sm mb-2"><span className="font-medium">Normal Passes:</span> {invoiceData.summary.normal_passes}</p>
        <p className="text-sm"><span className="font-medium">Early Passes:</span> {invoiceData.summary.early_passes}</p>
      </div>
    </div>
  );
};

export default Invoice;
