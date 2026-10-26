import React from 'react';
import PublicLegalPage from './PublicLegalPage';
import { useGetPrivacyQuery } from '../../RTK/privacy/privacyApi';

const PublicPrivacyPage = () => {
  const { data, isLoading, isFetching } = useGetPrivacyQuery();

  return (
    <PublicLegalPage
      title="Privacy Policy"
      type="privacy"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export default PublicPrivacyPage;
