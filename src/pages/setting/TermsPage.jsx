import React, { useEffect, useState } from 'react';
import CustomJoditEditor from '../../components/common/JoditEditor';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';
import Loader from '../../components/shared/Loader';

const TermsPage = () => {
    const [termsContent, setTermsContent] = useState(`
    <ul>
      <li>You Can Cancel Or Reschedule A Job Before The Cutoff Time Shown In The App.</li>
      <li>Refund Eligibility Depends On Timing Of Cancellation And Local Policy.</li>
      <li>If A Driver Is Already En Route Or Job Is In Progress, Refund May Be Partial Or UnavAilable.</li>
    </ul>
  `);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleContentChange = (newContent) => {
        setTermsContent(newContent);
    };

    const handleUpdate = () => {
        console.log("Updated Terms and Condition Content:", termsContent);
        // Here you would typically send the content to a backend
        toast.success("Terms and Condition Content updated!");
    };

    return (
        <Loader size="large" spinning={isLoading} tip="Loading...">
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
                            >
                                Update
                            </CustomButton>
                        </div>
                    </div>
                </CustomCard>
            </div>
        </Loader>
    );
};
export default TermsPage;
