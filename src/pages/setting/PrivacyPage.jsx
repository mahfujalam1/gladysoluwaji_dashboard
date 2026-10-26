import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomJoditEditor from '../../components/common/JoditEditor';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
import Loader from '../../components/shared/Loader';
import { useGetPrivacyQuery, useUpdatePrivacyMutation } from '../../RTK/privacy/privacyApi';
import { LuExternalLink } from 'react-icons/lu';

const PrivacyPage = () => {
    const { data, isLoading, isFetching } = useGetPrivacyQuery();
    const [privacyContent, setPrivacyContent] = useState('');

    useEffect(() => {
        if (data?.data?.content) {
            setPrivacyContent(data.data.content);
        }
    }, [data]);

    const navigate = useNavigate();
    const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();

    const handleContentChange = (newContent) => {
        setPrivacyContent(newContent);
    };

    const handleUpdate = async () => {
        try {
            await updatePrivacy({ type: 'privacy_policy', content: privacyContent }).unwrap();
            toast.success("Privacy & Policy content updated!");
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
        <Loader spinning={isLoading || isFetching} tip="Loading...">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Privacy & Policy</h1>
                    <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#006C93] hover:text-[#005472] bg-white border border-[#006C93]/30 hover:border-[#006C93] px-3.5 py-1.5 rounded-lg transition shadow-2xs"
                    >
                        <span>View Public Page</span>
                        <LuExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <CustomCard>
                    <div className="p-4">
                        <CustomJoditEditor
                            initialContent={privacyContent}
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
export default PrivacyPage;
