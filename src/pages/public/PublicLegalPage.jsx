import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/shared/Loader';
import { LuShield, LuFileText } from 'react-icons/lu';
import PublicNavbar from './PublicNavbar';

const PublicLegalPage = ({ title, type, data, isLoading, isFetching }) => {
  const content = data?.data?.content;
  const updatedAt = data?.data?.updatedAt;

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const isTerms = type === 'terms';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <PublicNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Loader spinning={isLoading || isFetching} tip="Loading document...">
          <article className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-10 md:p-12">
            {/* Header info inside card */}
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#006C93] mb-2">
                {isTerms ? <LuFileText className="w-4 h-4" /> : <LuShield className="w-4 h-4" />}
                <span>Legal Document</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              {formattedDate && (
                <p className="mt-2 text-sm text-slate-500">
                  Last updated on <span className="font-medium text-slate-700">{formattedDate}</span>
                </p>
              )}
            </div>

            {/* Rendered HTML Content */}
            {content ? (
              <div
                className="legal-content prose prose-slate max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              !isLoading && (
                <div className="text-center py-12 text-slate-400">
                  <p>No content available at the moment.</p>
                </div>
              )
            )}
          </article>
        </Loader>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto print:hidden">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} WeCure Health. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/terms" className="hover:text-[#006C93] transition">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#006C93] transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#006C93] transition">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLegalPage;
