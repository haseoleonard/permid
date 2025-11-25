'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/hooks/useIdentity';
import { useSnackbar } from '@/contexts/SnackbarContext';

export default function CreateProfilePage() {
  const router = useRouter();
  const { createProfile, loading } = useIdentity();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    email: '',
    dob: '',
    name: '',
    idNumber: '',
    location: '',
    experience: '',
    country: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const MAX_TEXT_LENGTH = 8; // uint64 supports up to 8 characters

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getFieldError = (field: string, value: string): string | null => {
    if (['name', 'email', 'idNumber', 'location', 'country'].includes(field)) {
      if (value.length > MAX_TEXT_LENGTH) {
        return `Max ${MAX_TEXT_LENGTH} characters (current: ${value.length})`;
      }
    }
    return null;
  };

  const hasValidationErrors = (): boolean => {
    return ['name', 'email', 'idNumber', 'location', 'country'].some(
      field => formData[field as keyof typeof formData].length > MAX_TEXT_LENGTH
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasValidationErrors()) {
      showSnackbar('Please fix validation errors before submitting', 'error');
      return;
    }

    // Set local loading state IMMEDIATELY (synchronous)
    setIsCreating(true);

    try {
      // Small delay to let React render the loading state before heavy encryption
      await new Promise(resolve => setTimeout(resolve, 50));

      await createProfile(formData);
      showSnackbar('Profile created successfully!', 'success');
      router.push('/');
    } catch (error) {
      console.error('Error creating profile:', error);
      showSnackbar('Failed to create profile', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-slate-50 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Your Confidential Profile
          </h1>
          <p className="text-slate-600 mb-8">
            All data is encrypted on-chain. Only you can decrypt and share specific fields.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-slate-400 text-xs">(max 8 chars)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                maxLength={MAX_TEXT_LENGTH}
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${getFieldError('name', formData.name) ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="JohnDoe"
              />
              {getFieldError('name', formData.name) && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('name', formData.name)}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email/Username <span className="text-slate-400 text-xs">(max 8 chars)</span>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                required
                maxLength={MAX_TEXT_LENGTH}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${getFieldError('email', formData.email) ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="john123"
              />
              {getFieldError('email', formData.email) && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('email', formData.email)}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* ID Number */}
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-slate-700 mb-2">
                ID Number <span className="text-slate-400 text-xs">(max 8 chars)</span>
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                required
                maxLength={MAX_TEXT_LENGTH}
                value={formData.idNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${getFieldError('idNumber', formData.idNumber) ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="12345678"
              />
              {getFieldError('idNumber', formData.idNumber) && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('idNumber', formData.idNumber)}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                Location <span className="text-slate-400 text-xs">(max 8 chars)</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                maxLength={MAX_TEXT_LENGTH}
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${getFieldError('location', formData.location) ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="NYC"
              />
              {getFieldError('location', formData.location) && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('location', formData.location)}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                Country <span className="text-slate-400 text-xs">(max 8 chars)</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                maxLength={MAX_TEXT_LENGTH}
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${getFieldError('country', formData.country) ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="USA"
              />
              {getFieldError('country', formData.country) && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('country', formData.country)}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                required
                min="0"
                max="99"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="5"
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-emerald-800">Privacy Protected</h3>
                  <p className="mt-1 text-sm text-emerald-700">
                    All fields are encrypted using FHEVM. Nobody can read your data without your explicit permission.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-slate-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || loading}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {(isCreating || loading) ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
