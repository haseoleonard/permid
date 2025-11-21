'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useIdentity } from '@/hooks/useIdentity';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { DataField, FIELD_LABELS, FieldAccessMap } from '@/types';
import { uint64ToString, uint64ToDate, uint64ToNumber } from '@/lib/utils/encoding';

export default function ProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { authenticated, user } = usePrivy();
  const {
    hasProfile: checkHasProfile,
    requestAccess,
    getAndDecryptField,
    getGrantedFields,
    getAccessRequestStatus,
    loading
  } = useIdentity();
  const { showSnackbar } = useSnackbar();

  const profileAddress = params.address as string;
  const [exists, setExists] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [grantedFields, setGrantedFields] = useState<FieldAccessMap>({} as FieldAccessMap);
  const [sharedData, setSharedData] = useState<Record<DataField, string>>({} as any);
  const [requestStatus, setRequestStatus] = useState<{
    exists: boolean;
    pending: boolean;
    granted: boolean;
    message: string;
  }>({ exists: false, pending: false, granted: false, message: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfileData();
  }, [profileAddress, user]);

  const loadProfileData = async () => {
    try {
      // Check if profile exists
      const profileExists = await checkHasProfile(profileAddress);
      setExists(profileExists);

      // Check if it's the user's own profile
      const ownProfile = user?.wallet?.address?.toLowerCase() === profileAddress.toLowerCase();
      setIsOwnProfile(ownProfile);

      if (!ownProfile && authenticated) {
        // Load access request status
        const status = await getAccessRequestStatus(
          profileAddress,
          user?.wallet?.address || ''
        );
        setRequestStatus(status);

        // If access is granted, load granted fields and shared data
        if (status.granted) {
          const fields = await getGrantedFields(profileAddress, user?.wallet?.address || '');
          setGrantedFields(fields);

          // Load shared field values with client-side decryption
          const data: Record<DataField, string> = {} as any;
          const fieldIds = [
            DataField.EMAIL,
            DataField.DOB,
            DataField.NAME,
            DataField.ID_NUMBER,
            DataField.LOCATION,
            DataField.EXPERIENCE,
            DataField.COUNTRY,
          ];

          for (const fieldId of fieldIds) {
            if (fields[fieldId]) {
              try {
                // Decrypt the field client-side
                const value = await getAndDecryptField(profileAddress, fieldId);

                // Decode the uint64 value based on field type
                let displayValue: string;
                if (fieldId === DataField.DOB) {
                  displayValue = uint64ToDate(value);
                } else if (fieldId === DataField.EXPERIENCE) {
                  displayValue = uint64ToNumber(value).toString();
                } else {
                  displayValue = uint64ToString(value);
                }

                data[fieldId] = displayValue;
              } catch (error) {
                console.log(`Error decrypting field ${fieldId}:`, error);
              }
            }
          }
          setSharedData(data);
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleRequestAccess = async () => {
    if (!message.trim()) {
      showSnackbar('Please enter a message explaining why you need access', 'error');
      return;
    }

    try {
      await requestAccess(profileAddress, message);
      showSnackbar('Access request sent successfully!', 'success');
      setMessage('');
      await loadProfileData();
    } catch (error) {
      console.error('Error requesting access:', error);
      showSnackbar('Failed to send access request', 'error');
    }
  };

  const allFields: DataField[] = [
    DataField.EMAIL,
    DataField.DOB,
    DataField.NAME,
    DataField.ID_NUMBER,
    DataField.LOCATION,
    DataField.EXPERIENCE,
    DataField.COUNTRY,
  ];

  if (!exists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">
              No profile exists for address: <span className="font-mono">{profileAddress}</span>
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Profiles
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isOwnProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h1>
            <p className="text-gray-600 mb-6">
              This is your own profile. Visit the dashboard to manage access requests.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Profiles
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Details</h1>
              <p className="text-sm text-gray-600 font-mono break-all">{profileAddress}</p>
            </div>
          </div>

          {/* Access Status */}
          {!authenticated ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                Connect your wallet to request access to this profile
              </p>
            </div>
          ) : requestStatus.pending ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-1">Request Pending</h3>
              <p className="text-sm text-blue-700">
                Your access request is waiting for approval from the profile owner.
              </p>
              {requestStatus.message && (
                <p className="text-sm text-blue-600 mt-2">
                  Your message: "{requestStatus.message}"
                </p>
              )}
            </div>
          ) : requestStatus.granted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-3">✅ Access Granted</h3>
              <p className="text-sm text-green-700 mb-4">
                You have been granted access to the following fields:
              </p>

              {/* Info banner - loading state */}
              {Object.values(sharedData).length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-blue-800 flex-1">
                      ℹ️ <strong>Loading encrypted data...</strong> Your browser is decrypting the shared fields. This may take a moment.
                    </p>
                    <button
                      onClick={loadProfileData}
                      disabled={loading}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {loading ? 'Decrypting...' : 'Retry'}
                    </button>
                  </div>
                </div>
              )}

              {/* Shared Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allFields.map((field) => (
                  <div
                    key={field}
                    className={`p-4 rounded-lg border ${
                      grantedFields[field]
                        ? 'bg-white border-green-300'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {FIELD_LABELS[field]}
                    </div>
                    <div className="text-sm text-gray-900">
                      {grantedFields[field] ? (
                        sharedData[field] ? (
                          <span className="font-mono">{sharedData[field]}</span>
                        ) : (
                          <span className="text-yellow-600 flex items-center gap-1">
                            ⏳ Decrypting...
                          </span>
                        )
                      ) : (
                        <span className="text-gray-400">Not shared</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Request Access</h2>
              <p className="text-gray-600 mb-4">
                Send a request to the profile owner explaining why you need access to their data.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Profile Owner
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hi, I would like to request access to your profile data for..."
                />
              </div>

              <button
                onClick={handleRequestAccess}
                disabled={loading || !message.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Access Request'}
              </button>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to all profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
