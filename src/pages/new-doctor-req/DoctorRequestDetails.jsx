import React, { useState } from 'react';
import CustomCard from '../../components/common/CustomCard';
import { IoIosArrowBack } from 'react-icons/io';
import { Image, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomButton from '../../components/shared/Button';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import toast from '../../utils/toast';


const DoctorRequestDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { doctor } = state || {};

    const handleApprove = (id) => {
        toast.success("Request approved successfully!");
        console.log("Approved:", id);
        // Here you would typically make an API call to approve the request
        // For now, we'll just navigate back
        navigate('/doctor-requests');
    };

    const handleReject = (id) => {
        toast.warning("Request rejected!");
        console.log("Rejected:", id);
        // Here you would typically make an API call to reject the request
        // For now, we'll just navigate back
        navigate('/doctor-requests');
    };

    if (!doctor) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Doctor data not found. Please go back and select a doctor.</p>
                <button onClick={() => navigate(-1)} className="ml-4 p-2 bg-[#005877] text-white rounded">
                    Go Back
                </button>
            </div>
        );
    }


    const {
        name,
        Specialties,
        avatar,
        doctorContact,
        email,
        requestDate,
        doctorId,
        hospital,
        documents,
    } = doctor;

    return (
        <div className=''>
            <h1 className="flex items-center text-2xl font-bold mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-3 flex items-center justify-center h-10 w-10 rounded-full bg-white cursor-pointer"
                    aria-label="Go back"
                >
                    <IoIosArrowBack size={28} />
                </button>
                <span>Doctor Request Details</span>
            </h1>

            <CustomCard className="p-8 w-full">
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center">
                        <img
                            src={avatar}
                            alt={name}
                            className="w-32 h-32 rounded-full object-cover mr-6"
                        />
                        <div>
                            <div className='flex gap-2'>
                                <h2 className="text-2xl font-bold">{name}</h2>
                            </div>
                            <p className="text-gray-700 mt-1">{Specialties}</p>
                            <p className="text-gray-700">{hospital}</p>
                            {doctorId && <p className="text-gray-700">National ID: {doctorId}</p>}
                            <p className="text-gray-700 mt-2">{email}</p>
                            <p className="text-gray-700">{doctorContact}</p>
                        </div>
                    </div>

                    <div className="text-right text-sm text-gray-700">
                        <p><span className="font-semibold">Requested Date:</span> {requestDate}</p>
                    </div>
                </div>

                {/* Documents */}
                <div className='mt-4'>
                    <div>
                        <h1 className='text-2xl font-semibold mb-6'>Documents</h1>
                        <div key="1">
                            <div className='flex gap-2'>
                                <Image.PreviewGroup>
                                    {documents?.length > 0 ? (
                                        documents.map((document, index) => (
                                            <Image
                                                key={index}
                                                src={document.ImageUrl}
                                                alt={`document-${index}`}
                                                className="w-32! h-32!"
                                            />
                                        ))
                                    ) : (
                                        <p>No Documents found.</p>
                                    )}
                                </Image.PreviewGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-4 justify-end mt-4'>
                    <CustomPopconfirm
                        title="Are you sure to Reject this request?"
                        onConfirm={() => handleReject(doctor.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button title="Reject Request" danger className='text-xl! py-5! px-5!'>Reject</Button>
                    </CustomPopconfirm>

                    <CustomPopconfirm
                        title="Are you sure to Approve this request?"
                        onConfirm={() => handleApprove(doctor.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <CustomButton title="Approve Request" className='text-xl! py-5! px-4! hover:border-[#006C93]!'>Approve</CustomButton>
                    </CustomPopconfirm>
                </div>
            </CustomCard>
        </div>
    );
};

export default DoctorRequestDetails;
