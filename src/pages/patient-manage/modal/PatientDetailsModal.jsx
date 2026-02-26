import React, { useState } from 'react';
import { Modal, Tag } from 'antd';
// import CustomButton from '../../../components/shared/Button';

const PatientDetailsModal = ({ open, onClose, patient }) => {
    if (!patient) {
        return null;
    }

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(patient.id.toString());
        setCopied(true);

        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <Modal
            title={<h2 className="text-2xl font-bold">Patient Details</h2>}
            centered
            open={open}
            onCancel={onClose}
            footer={[
                <div key="footer" className="text-right">
                    {/* <CustomButton key="close" onClick={onClose} className="px-8! py-2! h-auto!">
                        Close
                    </CustomButton> */}
                </div>
            ]}
            width={800}
        >
            <div className="p-6">
                {/* Top Section */}
                <div className="flex items-center mb-8">
                    <img src={patient.avatar} alt={patient.name} className="w-24 h-24 rounded-full object-cover mr-6" />
                    <div>
                        <div
                            onClick={handleCopy}
                            className={`inline-block border border-[#006C93] text-[#006C93] rounded-full px-2 py-1 text-sm cursor-pointer transition-all duration-300 ${copied ? "border-green-600 text-green-600" : ""
                                }`}
                        >
                            {copied ? "Copied!" : `ID: ${patient.id}`}
                        </div>
                        <h3 className="text-2xl font-bold">{patient.name}</h3>
                        <p className="text-gray-800">{patient.email}</p>
                        <p className="text-gray-800">Emergency Phone Number: {patient.emergencyContact}</p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p className="font-semibold text-gray-600">Date Of Birth :</p>
                            <p className="text-gray-800">{patient.dob}</p>

                            <p className="font-semibold text-gray-600">Blood Group :</p>
                            <p className="text-gray-800">{patient.bloodGroup}</p>

                            <p className="font-semibold text-gray-600">Allergies :</p>
                            <div>
                                {patient.allergies.map((allergy, index) => (
                                    <Tag key={index} className="bg-gray-100! border-none! rounded-md! mr-1! px-2! py-0.5! mb-1!">
                                        {allergy}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Bank Information</h4>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p className="font-semibold text-gray-600">Bank Name :</p>
                            <p className="text-gray-800">{patient?.bankName || 'N/A'}</p>

                            <p className="font-semibold text-gray-600">Account Name :</p>
                            <p className="text-gray-800">{patient?.accountName || 'N/A'}</p>

                            <p className="font-semibold text-gray-600">Account Number :</p>
                            <p className="text-gray-800">{patient?.accountNumber || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PatientDetailsModal;