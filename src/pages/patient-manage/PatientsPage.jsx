import React, { useState, useEffect, useMemo } from 'react';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import CustomCard from '../../components/common/CustomCard';
import CustomPopconfirm from '../../components/shared/Popconfirm';
import toast from '../../utils/toast';
import PatientDetails from './modal/PatientDetailsModal';
// import { LuTrash2 } from 'react-icons/lu';
import CustomPagination from '../../components/shared/Pagination';
import { useGetPatientsQuery, useTogglePatientStatusMutation } from '../../RTK/patient/patientApi';
import Loader from '../../components/shared/Loader';
import SearchInput from '../../components/common/SearchInput';

const PatientsPage = () => {
    const [patientData, setPatientData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: patients, isLoading, error } = useGetPatientsQuery({
        page: currentPage,
        limit: patientsPerPage
    });
    const [togglePatientStatus] = useTogglePatientStatusMutation();

    useEffect(() => {
        if (patients?.data) {
            const mappedPatients = (Array.isArray(patients.data) ? patients.data : [patients.data]).map(patient => ({
                id: patient._id,
                name: patient.name,
                avatar: patient.profileImage || 'https://placehold.net/avatar.svg?text=TF&bg=212121',
                emergencyContact: patient.phone || 'N/A',
                email: patient.email,
                addedDate: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
                isBlock: patient.status === 'BLOCKED',
                dob: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-GB') : 'N/A',
                bloodGroup: patient.bloodGroup || 'N/A',
                allergies: patient.allergies || [],
                status: patient.status,
                accountName: patient?.accountName,
                accountNumber: patient?.accountNumber,
                bankName: patient?.bankName,


            }));
            setPatientData(mappedPatients);
        }
    }, [patients]);

    const handleDelete = (id) => {
        toast.success("Patient deleted successfully!");
        setPatientData(prev => prev.filter(patient => patient.id !== id));
    };

    const toggleBlock = async (id) => {
        try {
            await togglePatientStatus(id).unwrap();
            toast.success('Patient status updated!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update status');
        }
    };

    const showModal = (patient) => {
        setSelectedPatient(patient);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedPatient(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const filteredPatients = useMemo(() => {
        if (!searchTerm.trim()) return patientData;
        const term = searchTerm.toLowerCase();
        return patientData.filter((patient) =>
            patient.name?.toLowerCase().includes(term) ||
            patient.email?.toLowerCase().includes(term) ||
            patient.emergencyContact?.toLowerCase().includes(term) ||
            patient.id?.toLowerCase().includes(term)
        );
    }, [searchTerm, patientData]);

    if (error) {
        return <div className="text-center py-20 text-red-500">Error loading patients: {error?.data?.message || 'Something went wrong'}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onSearch={handleSearch}
                    placeholder="Search by name, email, phone..."
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Header */}
                <div className="grid grid-cols-6 gap-6 text-gray-500 font-semibold mb-2 px-8">
                    <div>Patients</div>
                    <div>ID</div>
                    <div>Contact number</div>
                    <div>Email address</div>
                    <div>Added date</div>
                    <div className="text-center">Action</div>
                </div>

                {/* Rows */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader spinning={isLoading} />
                    </div>
                ) : (
                    filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <CustomCard
                                key={patient.id}
                                onClick={() => showModal(patient)}
                                className="grid grid-cols-6 items-center gap-6 py-4 px-8 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={patient.avatar}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-50"
                                    />
                                    <div className="font-medium truncate" title={patient.name}>{patient.name}</div>
                                </div>

                                <div className="text-gray-600 truncate" title={patient.id}>{patient.id}</div>
                                <div className="text-gray-600 truncate" title={patient.emergencyContact}>{patient.emergencyContact}</div>
                                <div className="text-gray-600 truncate" title={patient.email}>{patient.email}</div>
                                <div className="text-gray-600">{patient.addedDate}</div>

                                <div
                                    className="flex justify-center items-center gap-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <CustomPopconfirm
                                        title={`Are you sure to ${patient.isBlock ? 'unblock' : 'block'
                                            } this patient?`}
                                        onConfirm={() => toggleBlock(patient.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button title="Block / Unblock">
                                            {patient.isBlock ? (
                                                <FaUserSlash
                                                    size={24}
                                                    className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                                                />
                                            ) : (
                                                <FaUserCheck
                                                    size={24}
                                                    className="text-green-400 hover:text-green-500 transition-colors cursor-pointer"
                                                />
                                            )}
                                        </button>
                                    </CustomPopconfirm>

                                    {/* DELETE */}
                                    {/* <CustomPopconfirm
                                        title="Are you sure to delete this patient?"
                                        onConfirm={() => handleDelete(patient.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button title='Delete Patient' className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                            <LuTrash2 size={24} />
                                        </button>
                                    </CustomPopconfirm> */}
                                </div>

                            </CustomCard>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            {searchTerm ? `No patients matched "${searchTerm}"` : 'No patients found.'}
                        </div>
                    )
                )}
            </div>

            {!isLoading && !searchTerm && (
                <div className='flex justify-end mt-6'>
                    <CustomPagination
                        showSizeChanger={false}
                        total={patients?.meta?.total || patientData.length}
                        pageSize={patients?.meta?.limit || patientsPerPage}
                        onChange={handlePageChange}
                        current={currentPage}
                    />
                </div>
            )}

            <PatientDetails
                open={isModalVisible}
                onClose={handleClose}
                patient={selectedPatient}
            />
        </div>
    );
};

export default PatientsPage;