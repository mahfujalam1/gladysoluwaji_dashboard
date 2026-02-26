import React from 'react';
import { Collapse, Image, Modal, Spin, Tag } from 'antd';
import { useLocation } from 'react-router-dom';
import { useGetDoctorBookingDetailsByIdQuery } from '../../../RTK/doctor/doctorApi';

const { Panel } = Collapse;

const BookingDetailsModal = ({ open, onClose, appointmentDetails }) => {
    if (!appointmentDetails) return null;

    const { state } = useLocation();
    const { data: bookingDetails, isLoading } = useGetDoctorBookingDetailsByIdQuery(appointmentDetails.id, {
        skip: !open || !appointmentDetails?.id
    });

    const details = bookingDetails?.data || {};

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Modal
            title={<span className="text-2xl font-bold">Booking Details</span>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={950}
            centered
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Spin />
                </div>
            ) : (
                <div className="p-4">
                    <div className="flex justify-between items-start mb-6">
                        {/* Patient Info */}
                        <div className="flex items-center">
                            <img
                                src={details?.patient?.profileImage || 'https://placehold.net/avatar.svg'}
                                alt="patient avatar"
                                className="w-24 h-24 rounded-full mr-4 object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-bold">{details?.patient?.name || 'N/A'}</h2>
                                <p className="text-gray-600">{details?.patient?.email || 'N/A'}</p>
                                <p className="text-gray-600">{details?.patient?.phone || 'N/A'}</p>
                                <p className="text-gray-600 mb-1">
                                    Blood Group: <span className="font-semibold">{details?.patient?.bloodGroup || 'N/A'}</span>
                                </p>
                                {details?.patient?.allergies?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {details.patient.allergies.map((allergy, index) => (
                                            <Tag key={index} color="blue">{allergy}</Tag>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Booking Date */}
                        <div className="text-sm text-gray-700 font-semibold">
                            Booking Date : {formatDate(details?.createdAt)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mb-6">
                        {/* Appointment Details */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Appointment Fee</p>
                            <p className="text-base text-gray-800">${details?.consultationFee || '0'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Visiting Date</p>
                            <p className="text-base text-gray-800">{formatDate(details?.appointmentDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Time</p>
                            <p className="text-base text-gray-800">
                                {details?.appointmentTime} - {details?.appointmentEndTime}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                            <p
                                className={`text-sm px-1 w-24 text-center rounded-full border
                                    ${details?.status === 'COMPLETED'
                                        ? 'text-green-700 bg-green-100 border-green-300'
                                        : details?.status === 'PENDING'
                                            ? 'text-yellow-700 bg-yellow-100 border-yellow-300'
                                            : details?.status === 'CANCELLED' ? 'text-red-700 bg-red-100 border-red-300'
                                                : 'text-gray-700 bg-gray-100 border-gray-300'
                                    }`}
                            >
                                {details?.status || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                        {/* Doctor Info */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Doctor</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <img
                                    src={details?.doctor?.userId?.profileImage || 'https://placehold.net/avatar.svg'}
                                    alt="doctor"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-base font-bold text-gray-800">{details?.doctor?.userId?.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-600">{details?.specialty || 'N/A'}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{details?.doctor?.currentOrganization || 'N/A'}</p>
                        </div>

                        {/* Visit Reason */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Visit Reason</h3>
                            <p className="text-base text-gray-800">{details?.reasonTitle || 'N/A'}</p>
                        </div>

                        {/* Detail Info */}
                        <div className="md:col-span-1">
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Detail Info</h3>
                            <p className="text-base text-gray-800">{details?.reasonDetails || 'N/A'}</p>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <Collapse>
                            <Panel header="Attachments" key="1">
                                <div className='flex flex-col gap-4'>
                                    {/* PDFs */}
                                    <div className='flex flex-wrap gap-4'>
                                        {details?.attachments?.filter(att => att.fileType === 'application/pdf').map((attachment, index) => (
                                            <a
                                                key={`pdf-${index}`}
                                                href={attachment.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-32 h-32 flex flex-col justify-center items-center bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600 no-underline"
                                            >
                                                <span className="text-3xl font-bold text-red-500">PDF</span>
                                                <span className="text-xs mt-2 px-2 text-center text-gray-500 w-full truncate">View Document</span>
                                            </a>
                                        ))}
                                    </div>

                                    {/* Images */}
                                    {details?.attachments?.some(att => att.fileType !== 'application/pdf') && (
                                        <div className='flex flex-wrap gap-4'>
                                            <Image.PreviewGroup>
                                                {details.attachments.filter(att => att.fileType !== 'application/pdf').map((attachment, index) => (
                                                    <Image
                                                        key={`img-${index}`}
                                                        src={attachment.url}
                                                        alt={`document-${index}`}
                                                        className="w-32! h-32! object-cover rounded-lg border border-gray-200"
                                                    />
                                                ))}
                                            </Image.PreviewGroup>
                                        </div>
                                    )}

                                    {(!details?.attachments || details.attachments.length === 0) && (
                                        <p className="text-gray-500 italic">No Documents found.</p>
                                    )}
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default BookingDetailsModal;
