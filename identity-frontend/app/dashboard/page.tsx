'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useIdentity } from '@/hooks/useIdentity';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { DataField, FIELD_LABELS } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = usePrivy();
  const {
    hasProfile,
    getMyIncomingRequests,
    getMyOutgoingRequests,
    grantAccess,
    revokeAccess,
    getGrantedFields,
    getAccessRequestStatus,
    loading
  } = useIdentity();
  const { showSnackbar } = useSnackbar();

  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [grantedRequests, setGrantedRequests] = useState<string[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<string[]>([]);
  const [outgoingStatuses, setOutgoingStatuses] = useState<Record<string, { pending: boolean; granted: boolean }>>({});
  const [selectedFields, setSelectedFields] = useState<Record<string, DataField[]>>({});
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [grantedUsers, setGrantedUsers] = useState<Record<string, DataField[]>>({});

  useEffect(() => {
    if (user?.wallet?.address) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      const incoming = await getMyIncomingRequests();
      const outgoing = await getMyOutgoingRequests();
      setOutgoingRequests(outgoing);

      const myAddress = user?.wallet?.address;
      if (!myAddress) return;

      // Separate pending and granted requests
      const pending: string[] = [];
      const granted: Record<string, DataField[]> = {};
      const grantedAddresses: string[] = [];

      for (const requester of incoming) {
        try {
          // Check access request status
          const status = await getAccessRequestStatus(myAddress, requester);

          if (status.granted) {
            // Load granted fields
            const fields = await getGrantedFields(myAddress, requester);
            const grantedFieldsList = Object.entries(fields)
              .filter(([_, isGranted]) => isGranted)
              .map(([field]) => parseInt(field) as DataField);

            if (grantedFieldsList.length > 0) {
              granted[requester] = grantedFieldsList;
              grantedAddresses.push(requester);
            }
          } else if (status.pending) {
            pending.push(requester);
          }
        } catch (error) {
          console.log(`Could not load request status for ${requester}`);
          // If we can't get status, assume pending
          pending.push(requester);
        }
      }

      setPendingRequests(pending);
      setGrantedRequests(grantedAddresses);
      setGrantedUsers(granted);

      // Check status for outgoing requests - follow same pattern as Profile Details
      const outgoingStatusMap: Record<string, { pending: boolean; granted: boolean }> = {};
      for (const dataOwner of outgoing) {
        try {
          const status = await getAccessRequestStatus(
            dataOwner,
            user?.wallet?.address || ''
          );

          // Only add to status map if the request exists
          if (status.exists) {
            outgoingStatusMap[dataOwner] = {
              pending: status.pending,
              granted: status.granted
            };
          }
        } catch (error) {
          console.error(`Error loading status for ${dataOwner}:`, error);
        }
      }
      setOutgoingStatuses(outgoingStatusMap);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const toggleField = (requester: string, field: DataField) => {
    setSelectedFields(prev => {
      const current = prev[requester] || [];
      const exists = current.includes(field);

      return {
        ...prev,
        [requester]: exists
          ? current.filter(f => f !== field)
          : [...current, field]
      };
    });
  };

  const handleGrantAccess = async (requester: string) => {
    const fields = selectedFields[requester] || [];

    if (fields.length === 0) {
      showSnackbar('Please select at least one field to share', 'error');
      return;
    }

    try {
      await grantAccess(requester, fields);
      showSnackbar('Access granted successfully! The requester can now view the shared fields.', 'success');
      setSelectedFields(prev => {
        const updated = { ...prev };
        delete updated[requester];
        return updated;
      });
      await loadRequests();
    } catch (error) {
      console.error('Error granting access:', error);
      showSnackbar('Failed to grant access', 'error');
    }
  };

  const handleRevokeAccess = async (requester: string) => {
    try {
      await revokeAccess(requester);
      showSnackbar('Access revoked successfully!', 'success');
      await loadRequests();
    } catch (error) {
      console.error('Error revoking access:', error);
      showSnackbar('Failed to revoke access', 'error');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your profile and access requests
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('incoming')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'incoming'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Incoming Requests
                {pendingRequests.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('outgoing')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'outgoing'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Outgoing Requests
                {outgoingRequests.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                    {outgoingRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'incoming' && (
              <div className="space-y-6">
                {/* Pending Requests Section */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Requests</h2>
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        All requests have been handled
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingRequests.map((requester) => (
                    <div key={requester} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Request from</h3>
                          <p className="text-sm text-gray-600 font-mono mt-1">{requester}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Select fields to share:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {allFields.map((field) => (
                            <label
                              key={field}
                              className="flex items-center space-x-2 p-2 rounded border border-gray-300 hover:bg-white cursor-pointer transition"
                            >
                              <input
                                type="checkbox"
                                checked={selectedFields[requester]?.includes(field) || false}
                                onChange={() => toggleField(requester, field)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{FIELD_LABELS[field]}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGrantAccess(requester)}
                          disabled={loading || !selectedFields[requester]?.length}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Grant Access
                        </button>
                        <button
                          onClick={() => handleRevokeAccess(requester)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Granted Users Section */}
                {grantedRequests.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      Granted Access
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      ✅ Users who have been granted access to your profile fields
                    </p>
                    <div className="space-y-4">
                      {Object.entries(grantedUsers).map(([user, fields]) => (
                        <div key={user} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="mb-3">
                            <h3 className="font-medium text-green-900">Granted to:</h3>
                            <p className="text-sm text-green-700 font-mono mt-1">{user}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-green-900 mb-2">
                              Shared fields:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {fields.map((field) => (
                                <span
                                  key={field}
                                  className="px-3 py-1 bg-white border border-green-300 text-green-700 rounded-lg text-sm"
                                >
                                  {FIELD_LABELS[field]}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3">
                            <button
                              onClick={() => handleRevokeAccess(user)}
                              disabled={loading}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Revoke All Access
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'outgoing' && (
              <div className="space-y-4">
                {outgoingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No outgoing requests</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Browse profiles to request access to someone's data.
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Browse Profiles
                    </button>
                  </div>
                ) : (
                  outgoingRequests.map((dataOwner) => (
                    <div key={dataOwner} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">Request to</h3>
                          <p className="text-sm text-gray-600 font-mono mt-1">{dataOwner}</p>
                          <div className="text-sm mt-2">
                            <span className="text-gray-700">Status: </span>
                            {outgoingStatuses[dataOwner]?.granted ? (
                              <span className="text-green-600 font-medium">✅ Access Granted</span>
                            ) : outgoingStatuses[dataOwner]?.pending ? (
                              <span className="text-yellow-600 font-medium">⏳ Pending Approval</span>
                            ) : (
                              <span className="text-gray-500">Loading...</span>
                            )}
                          </div>
                          {outgoingStatuses[dataOwner]?.granted && (
                            <button
                              onClick={() => router.push(`/profile/${dataOwner}`)}
                              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              View Shared Data →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
