import React from 'react';
import PublicLegalPage from './PublicLegalPage';
import { useGetTermsQuery } from '../../RTK/terms/termsApi';

const PublicTermsPage = () => {
  const { data, isLoading, isFetching } = useGetTermsQuery();

  return (
    <PublicLegalPage
      title="Terms & Conditions"
      type="terms"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export default PublicTermsPage;
