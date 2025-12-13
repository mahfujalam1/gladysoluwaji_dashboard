import React, { useState } from 'react';
import CustomJoditEditor from '../../components/common/JoditEditor';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/shared/Button';
import toast from '../../utils/toast';

const PrivacyPage = () => {
    const [privacyContent, setPrivacyContent] = useState(`
    <ul>
      <li>You Can Cancel Or Reschedule A Job Before The Cutoff Time Shown In The App.</li>
      <li>Refund Eligibility Depends On Timing Of Cancellation And Local Policy.</li>
      <li>If A Driver Is Already En Route Or Job Is In Progress, Refund May Be Partial Or UnavAilable.</li>
    </ul>
  `);

    const handleContentChange = (newContent) => {
        setPrivacyContent(newContent);
    };

    const handleUpdate = () => {
        console.log("Updated Privacy & Policy Content:", privacyContent);
        // Here you would typically send the content to a backend
        toast.success("Privacy & Policy content updated!");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Privacy & Policy</h1>
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
                        >
                            Update
                        </CustomButton>
                    </div>
                </div>
            </CustomCard>
        </div>
    );
};
export default PrivacyPage;
