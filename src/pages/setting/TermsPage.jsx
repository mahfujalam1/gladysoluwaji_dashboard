import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomJoditEditor from '../../components/common/JoditEditor';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
import Loader from '../../components/shared/Loader';
import { useGetTermsQuery, useUpdateTermsMutation } from '../../RTK/terms/termsApi';

const TermsPage = () => {
    const { data, isLoading, isFetching } = useGetTermsQuery();
    const [termsContent, setTermsContent] = useState('');

    useEffect(() => {
        if (data?.data?.content) {
            setTermsContent(data.data.content);
        }
    }, [data]);

    const navigate = useNavigate();
    const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsMutation();

    const handleContentChange = (newContent) => {
        setTermsContent(newContent);
    };

    const handleUpdate = async () => {
        try {
            await updateTerms({ type: 'terms_and_conditions', content: termsContent }).unwrap();
            toast.success("Terms & Conditions content updated!");
        } catch (error) {
            if (error?.status === 401) {
                toast.error("Session expired. Please login again.");
                navigate('/login');
            } else {
                toast.error(error?.data?.message || "Failed to update content.");
            }
        }
    };

    return (
        <Loader size="large" spinning={isLoading || isFetching} tip="Loading...">
            <div>
                <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
                <CustomCard>
                    <div className="p-4">
                        <CustomJoditEditor
                            initialContent={termsContent}
                            onChange={handleContentChange}
                        />
                        <div className="flex justify-end mt-4">
                            <CustomButton
                                onClick={handleUpdate}
                                type="primary"
                                className="p-5! text-xl!"
                                loading={isUpdating}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update'}
                            </CustomButton>
                        </div>
                    </div>
                </CustomCard>
            </div>
        </Loader>
    );
};
export default TermsPage;
