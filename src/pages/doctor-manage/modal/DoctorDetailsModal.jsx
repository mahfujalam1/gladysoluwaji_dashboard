import React, { useState } from 'react';
import { Image, Modal, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { defaultAvatar } from '../../../utils/imageUrl';
import defaultDocument from '../../../assets/default-document.svg';
import {
    LuBuilding,
    LuMail,
    LuPhone,
    LuCalendar,
    LuStethoscope,
    LuExternalLink,
    LuBriefcase,
    LuFileText,
    LuCheck,
    LuCopy
} from 'react-icons/lu';

const DoctorDetailsModal = ({ open, onClose, doctor, isLoading }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    if (!doctor) {
        return null;
    }

    const handleCopy = () => {
        const idToCopy = doctor.uid || doctor.id || "";
        navigator.clipboard.writeText(idToCopy.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Modal
            title={
                <div className="flex items-center justify-between pr-8 pb-3 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Doctor Profile Summary</h2>
                    <button
                        onClick={() => {
                            onClose();
                            navigate(`/doctor-requests-details/${doctor.id}`, { state: { doctor } });
                        }}
                        className="px-3 py-1 bg-[#006C93]/10 hover:bg-[#006C93] text-[#006C93] hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        <span>Full Review Page</span>
                        <LuExternalLink size={12} />
                    </button>
                </div>
            }
            centered
            open={open}
            onCancel={onClose}
            footer={null}
            width={850}
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="py-3 text-gray-900 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <img
                                src={doctor.avatar}
                                alt={doctor.name}
                                className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-2xs bg-white"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = defaultAvatar;
                                }}
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                                    <button
                                        onClick={handleCopy}
                                        title="Click to copy ID"
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium border border-[#006C93]/30 text-[#006C93] hover:bg-[#006C93]/10 transition-colors cursor-pointer"
                                    >
                                        {copied ? <LuCheck size={12} className="text-emerald-600" /> : <LuCopy size={12} />}
                                        <span>{copied ? 'Copied' : `ID: ${doctor.uid || doctor.id}`}</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                    <span className="font-semibold text-[#006C93]">{doctor.specialist}</span>
                                    <span>&middot;</span>
                                    <span>{doctor.hospital}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <LuMail size={12} /> {doctor.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <LuPhone size={12} /> {doctor.phone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left sm:text-right text-xs text-gray-500 space-y-1 self-start sm:self-auto">
                            <div>Registered: <strong className="text-gray-800">{doctor.requestedDate}</strong></div>
                            <div>Approved: <strong className="text-gray-800">{doctor.approvalDate}</strong></div>
                        </div>
                    </div>

                    {/* About & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">About</h4>
                            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                                {doctor.about || 'No description provided.'}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Services</h4>
                            {doctor.services?.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {doctor.services.map((s, index) => (
                                        <span
                                            key={index}
                                            className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-medium"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No services listed</p>
                            )}
                        </div>
                    </div>

                    {/* Experience Section */}
                    {doctor.experience && doctor.experience.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                                <LuBriefcase size={14} className="text-[#006C93]" />
                                Clinical Experience
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {doctor.experience.map((exp, index) => (
                                    <div key={index} className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs">
                                        <div className="font-bold text-gray-800">{exp.hospital}</div>
                                        <div className="text-gray-600 mt-0.5">{exp.role}</div>
                                        <div className="text-[11px] text-gray-400 mt-1">{exp.period} &middot; {exp.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                            <LuFileText size={14} className="text-[#006C93]" />
                            Uploaded Documents
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            <Image.PreviewGroup>
                                {doctor.documents?.length > 0 ? (
                                    doctor.documents.map((doc, idx) => (
                                        <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                            <Image
                                                src={doc}
                                                alt={`doc-${idx}`}
                                                className="w-24! h-24! object-cover"
                                                fallback={defaultDocument}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No documents uploaded</p>
                                )}
                            </Image.PreviewGroup>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default DoctorDetailsModal;
