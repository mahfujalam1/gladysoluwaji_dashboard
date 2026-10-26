import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import toast from '../../utils/toast';
import {
  LuUser,
  LuMail,
  LuHeading,
  LuMessageSquare,
  LuSend,
  LuCircleCheck,
  LuClock,
  LuMapPin,
  LuFileText,
  LuShield,
  LuLifeBuoy,
} from 'react-icons/lu';

const PublicContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a subject or title';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter your message or description';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate submission network delay for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Fire success toast
      toast.success('Your message has been submitted successfully! We will get back to you soon.');

      // Clear the form
      setFormData({
        name: '',
        email: '',
        title: '',
        description: '',
      });
      setErrors({});
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Responsive Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page Hero */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#006C93]/10 text-[#006C93] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <LuLifeBuoy className="w-3.5 h-3.5" />
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch With Us
          </h1>
          <p className="mt-2.5 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed px-2">
            Have a question, feedback, or need help with WeCure Health services? Fill out the form
            below, and our support team will respond promptly.
          </p>
        </div>

        {/* Content Grid: Form first on mobile (order-1), info on bottom on mobile (order-2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Contact Form (order-1 on mobile, order-2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-7 bg-white rounded-2xl p-5 sm:p-8 md:p-10 border border-slate-200/80 shadow-xs">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Send us a Message</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your details below and we will contact you via email.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-800">
                <LuCircleCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <div className="font-semibold">Thank you for contacting us!</div>
                  <div className="text-emerald-700 mt-0.5">
                    Your message has been received. Our team will review your inquiry and get back to
                    you as soon as possible.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LuUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none ${
                      errors.name
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#006C93] focus:ring-2 focus:ring-[#006C93]/15'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LuMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none ${
                      errors.email
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#006C93] focus:ring-2 focus:ring-[#006C93]/15'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Title / Subject */}
              <div>
                <label htmlFor="title" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Title / Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LuHeading className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief subject of your inquiry"
                    className={`w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none ${
                      errors.title
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#006C93] focus:ring-2 focus:ring-[#006C93]/15'
                    }`}
                  />
                </div>
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Description / Message */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Description / Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                    <LuMessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please explain in detail how we can help you..."
                    className={`w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none resize-y ${
                      errors.description
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#006C93] focus:ring-2 focus:ring-[#006C93]/15'
                    }`}
                  />
                </div>
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 sm:py-3 rounded-xl bg-[#006C93] hover:bg-[#005472] text-white font-medium text-xs sm:text-sm transition shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <LuSend className="w-4 h-4" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Left: Contact Info & Policies (order-2 on mobile, order-1 on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-[#006C93] to-[#004e6b] text-white rounded-2xl p-5 sm:p-7 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-2">We’re Here to Help</h2>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-5">
                Our support team is dedicated to providing you with the best healthcare service
                experience. Feel free to reach out anytime.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <LuMail className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white/90">Email Support</div>
                    <a
                      href="mailto:support@wecurehealth.com"
                      className="text-white/80 hover:text-white transition underline truncate block"
                    >
                      support@wecurehealth.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <LuClock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white/90">Working Hours</div>
                    <div className="text-white/80">Monday – Friday: 9:00 AM – 6:00 PM</div>
                    <div className="text-white/60 text-[11px] sm:text-xs">Emergency support: 24/7</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <LuMapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white/90">Head Office</div>
                    <div className="text-white/80">WeCure Health Medical Services</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-2">Looking for policies?</h3>
              <p className="text-xs text-slate-500 mb-3.5">
                You can review our legal terms and privacy guidelines anytime:
              </p>
              <div className="flex flex-col space-y-1.5">
                <Link
                  to="/terms"
                  className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-[#006C93] p-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <span className="flex items-center space-x-2">
                    <LuFileText className="w-3.5 h-3.5 text-[#006C93]" />
                    <span>Terms & Conditions</span>
                  </span>
                  <span>→</span>
                </Link>
                <Link
                  to="/privacy"
                  className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-[#006C93] p-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <span className="flex items-center space-x-2">
                    <LuShield className="w-3.5 h-3.5 text-[#006C93]" />
                    <span>Privacy Policy</span>
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} WeCure Health. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center space-x-3 sm:space-x-4">
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

export default PublicContactPage;
