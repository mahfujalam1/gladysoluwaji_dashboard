import React, { useState } from 'react';
import { Collapse, Image, Modal, Tag, Spin } from 'antd';

const { Panel } = Collapse;

const DoctorDetailsModal = ({ open, onClose, doctor, isLoading }) => {
    if (!doctor) {
        return null;
    }

    const [preview, setPreview] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const idToCopy = doctor.uid || doctor.id || "";
        navigator.clipboard.writeText(idToCopy.toString());
        setCopied(true);

        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <div>
            <Modal
                title={<h2 className="text-2xl font-bold">Doctor Details</h2>}
                centered
                open={open}
                onCancel={onClose}
                footer={null}
                width={950}
            >
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="p-4 bg-white text-gray-900 mx-auto">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center">
                                <img
                                    src={doctor.avatar}
                                    alt={doctor.name}
                                    className="w-32 h-32 rounded-full object-cover mr-6"
                                />
                                <div>

                                    <div className='flex gap-2'>
                                        <h2 className="text-2xl font-bold">{doctor.name}</h2>
                                        <div
                                            onClick={handleCopy}
                                            className={`inline-block border border-[#006C93] text-[#006C93] rounded-full px-2 py-1 text-sm cursor-pointer transition-all duration-300 ${copied ? "border-green-600 text-green-600" : ""
                                                }`}
                                        >
                                            {copied ? "Copied!" : `ID: ${doctor.uid || doctor.id}`}
                                        </div>

                                    </div>
                                    <p className="text-gray-700 mt-1">{doctor.specialist}</p>
                                    <p className="text-gray-700">{doctor.hospital}</p>
                                    {doctor.uid && <p className="text-gray-700">National ID: {doctor.uid}</p>}
                                    <p className="text-gray-700 mt-2">{doctor.email}</p>
                                    <p className="text-gray-700">{doctor.phone}</p>
                                </div>
                            </div>

                            <div className="text-right text-sm text-gray-700">
                                <p><span className="font-semibold">Requested Date:</span> {doctor.requestedDate}</p>
                                <p><span className="font-semibold">Approval Date:</span> {doctor.approvalDate}</p>
                            </div>
                        </div>

                        {/* About + Services */}
                        <div className="flex justify-between mb-5">
                            <div className="w-1/2 pr-6">
                                <h3 className="font-semibold text-lg mb-2">About</h3>
                                <p className="text-gray-700 leading-relaxed">{doctor.about || 'N/A'}</p>
                            </div>

                            <div className="w-1/3">
                                <h3 className="font-semibold text-lg mb-2 text-right">Services</h3>
                                <ul className="text-gray-700 space-y-1">
                                    {doctor.services?.length > 0 ? (
                                        doctor.services.map((s, index) => (
                                            <li key={index} className="flex items-center justify-end">
                                                {s}
                                                <span className="w-2 h-2 bg-[#006C93] rounded-full ml-2"></span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-right">No services listed</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Bank + exp */}
                        <div className="flex justify-between mb-8">
                            {/* Bank */}
                            {doctor.bankInfo && Object.keys(doctor.bankInfo).length > 0 ? (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Bank Information</h3>
                                    <div className="grid grid-cols-2 gap-y-2 text-gray-700">
                                        <p className="font-semibold">Bank Name :</p>
                                        <p>{doctor.bankInfo?.bankName || 'N/A'}</p>

                                        <p className="font-semibold">Account Name :</p>
                                        <p>{doctor.bankInfo?.accountName || 'N/A'}</p>

                                        <p className="font-semibold">Account Number :</p>
                                        <p>{doctor.bankInfo?.accountNumber || 'N/A'}</p>
                                    </div>
                                </div>
                            ) : <p className="text-gray-700">No bank information listed</p>}

                            {/* Experience */}
                            {doctor.experience && doctor.experience.length > 0 ? (
                                <div className="text-right">
                                    <h3 className="font-semibold text-lg mb-2">Experience</h3>
                                    <div className="space-y-4">
                                        {doctor.experience.map((exp, index) => (
                                            <div key={index} className="text-gray-700">
                                                <p className="font-bold text-md">{exp.hospital}</p>
                                                <p>{exp.role}</p>
                                                <p className="text-sm text-gray-500">{exp.period} &middot; {exp.duration}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : <p className="text-gray-700">No experience listed</p>}
                        </div>

                        <div className='mt-4'>
                            <Collapse>
                                <Panel header="Documents">
                                    <div className='flex flex-wrap gap-2'>
                                        <Image.PreviewGroup>
                                            {doctor.documents?.length > 0 ? (
                                                doctor.documents.map((document, index) => {
                                                    return (
                                                        <Image
                                                            key={index}
                                                            src={document}
                                                            alt=""
                                                            className="w-32! h-32! object-cover"
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <p>No Documents found.</p>
                                            )}
                                        </Image.PreviewGroup>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DoctorDetailsModal;
