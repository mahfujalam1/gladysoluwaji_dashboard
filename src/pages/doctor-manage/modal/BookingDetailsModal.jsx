import React from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';

const BookingDetailsModal = ({ open, onClose, appointmentDetails }) => {
    if (!appointmentDetails) return null;

    const { state } = useLocation();

    const {
        patientName,
        avatar,
        contactNumber,
        email,
        bookingDate,
        visitingDate,
        visitingTime,
        appointmentFee,
        status,
        refundStatus,
        visitReason,
        detailsInfo,
        bankInfo,
    } = appointmentDetails;

    return (
        <Modal
            title={<span className="text-2xl font-bold">Booking Details</span>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={950}
            centered
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-6">
                    {/* Patient Info */}
                    <div className="flex items-center">
                        <img src={avatar} alt="patient avatar" className="w-24 h-24 rounded-full mr-4" />
                        <div>
                            <h2 className="text-xl font-bold">{patientName}</h2>
                            <p className="text-gray-600">{email}</p>
                            <p className="text-gray-600">{contactNumber}</p>
                        </div>
                    </div>
                    {/* Booking Date */}
                    <div className="text-sm text-gray-700 font-semibold">
                        Booking Date : {bookingDate}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mb-6">
                    {/* Bank Info */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Bank Name</p>
                        <p className="text-base text-gray-800">{bankInfo.bankName}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Account Name</p>
                        <p className="text-base text-gray-800">{bankInfo.accountName}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Account Number</p>
                        <p className="text-base text-gray-800 px-2 py-1 rounded inline-block">
                            {bankInfo.accountNumber}
                        </p>
                    </div>

                    {/* Appointment Details */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Appointment Fee</p>
                        <p className="text-base text-gray-800">${appointmentFee}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Visiting Date</p>
                        <p className="text-base text-gray-800">{visitingDate}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Time</p>
                        <p className="text-base text-gray-800">{visitingTime}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                        <p
                            className={`text-sm px-1 w-20 text-center rounded-full border
                                ${status === 'Completed'
                                    ? 'text-green-700 bg-green-100 border-green-300'
                                    : status === 'Pending'
                                        ? 'text-yellow-700 bg-yellow-100 border-yellow-300'
                                        : status === 'Canceled' ? 'text-red-700 bg-red-100 border-red-300'
                                            : 'text-gray-700 bg-gray-100 border-gray-300'
                                }`}
                        >
                            {status}
                        </p>

                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Refund Status</p>
                        <p
                            className={`text-sm px-1 w-20 text-center 
                                ${refundStatus === 'Refunded' ? 'text-green-700 bg-green-100 rounded-full border border-green-300'
                                    : refundStatus === 'Approved' ? 'text-sky-700 bg-sky-100 rounded-full border border-sky-300'
                                        : refundStatus === 'Pending' ? 'text-yellow-700 bg-yellow-100 rounded-full border border-yellow-300'
                                            : ''
                                }`}
                        >
                            {refundStatus ?? '-'}
                        </p>

                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                    {/* Doctor Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Doctor</h3>
                        <p className="text-base font-bold text-gray-800">{state?.name}</p>
                        <p className="text-sm text-gray-600">{state?.specialist}</p>
                        <p className="text-sm text-gray-600">{state?.hospital}</p>
                    </div>

                    {/* Visit Reason */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Visit Reason</h3>
                        <p className="text-base text-gray-800">{visitReason}</p>
                    </div>

                    {/* Detail Info */}
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Detail Info</h3>
                        <p className="text-base text-gray-800">{detailsInfo}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BookingDetailsModal;
