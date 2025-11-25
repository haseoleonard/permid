'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useIdentity } from '@/hooks/useIdentity';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { DataField, FIELD_LABELS } from '@/types';
import { uint64ToString, uint64ToDate, uint64ToNumber } from '@/lib/utils/encoding';

type ProfileData = {
  email: string;
  dob: string;
  name: string;
  idNumber: string;
  location: string;
  experience: string;
  country: string;
};

export default function MyProfilePage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const {
    hasProfile: checkHasProfile,
    getAndDecryptMyField,
    updateProfile,
    loading
  } = useIdentity();
  const { showSnackbar } = useSnackbar();

  const [profileExists, setProfileExists] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    email: '',
    dob: '',
    name: '',
    idNumber: '',
    location: '',
    experience: '',
    country: '',
  });
  const [editedData, setEditedData] = useState<ProfileData>({
    email: '',
    dob: '',
    name: '',
    idNumber: '',
    location: '',
    experience: '',
    country: '',
  });
  const [revealedFields, setRevealedFields] = useState<Set<keyof ProfileData>>(new Set());
  const [revealingField, setRevealingField] = useState<keyof ProfileData | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  // Load profile data
  const loadProfile = async () => {
    if (!user?.wallet?.address) return;

    try {
      setLoadingProfile(true);

      // Check if profile exists
      const exists = await checkHasProfile(user.wallet.address);
      setProfileExists(exists);

      if (!exists) {
        setLoadingProfile(false);
        return;
      }

      // Just check that profile exists - don't decrypt automatically
      // User will click "Reveal" buttons to decrypt individual fields
    } catch (error) {
      console.error('Error loading profile:', error);
      showSnackbar('Failed to load profile data', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, user?.wallet?.address]);

  const handleRevealField = async (fieldKey: keyof ProfileData) => {
    if (!user?.wallet?.address) return;

    try {
      setRevealingField(fieldKey);

      // Small delay to let React render the loading state before heavy decryption
      await new Promise(resolve => setTimeout(resolve, 0));

      // Map profile key to DataField enum
      const fieldMapping: Record<keyof ProfileData, DataField> = {
        email: DataField.EMAIL,
        dob: DataField.DOB,
        name: DataField.NAME,
        idNumber: DataField.ID_NUMBER,
        location: DataField.LOCATION,
        experience: DataField.EXPERIENCE,
        country: DataField.COUNTRY,
      };

      const fieldId = fieldMapping[fieldKey];

      // Use getAndDecryptMyField instead of getAndDecryptField for own profile
      const value = await getAndDecryptMyField(fieldId);

      // Decode based on field type
      let displayValue: string;
      if (fieldId === DataField.DOB) {
        displayValue = uint64ToDate(value);
      } else if (fieldId === DataField.EXPERIENCE) {
        displayValue = uint64ToNumber(value).toString();
      } else {
        displayValue = uint64ToString(value);
      }

      setProfileData(prev => ({ ...prev, [fieldKey]: displayValue }));
      setRevealedFields(prev => new Set([...prev, fieldKey]));
    } catch (error) {
      console.error(`Error decrypting field ${fieldKey}:`, error);
      showSnackbar(`Failed to decrypt ${fieldKey}`, 'error');
    } finally {
      setRevealingField(null);
    }
  };

  const handleRevealAll = async () => {
    const fields: (keyof ProfileData)[] = ['email', 'dob', 'name', 'idNumber', 'location', 'experience', 'country'];

    for (const field of fields) {
      if (!revealedFields.has(field)) {
        await handleRevealField(field);
      }
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedData({ ...profileData });
  };

  const handleSave = async () => {
    // Set local loading state IMMEDIATELY (synchronous)
    setIsSaving(true);

    try {
      // Small delay to let React render the loading state before heavy encryption
      await new Promise(resolve => setTimeout(resolve, 50));

      // Update the profile (access revocation handled automatically by contract)
      await updateProfile(editedData);
      showSnackbar('Profile updated successfully! All previous access grants have been revoked.', 'success');

      setProfileData(editedData);
      setRevealedFields(new Set()); // Clear revealed state after update
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!authenticated) {
    return null; // Redirecting
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileExists) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">No Profile Found</h1>
            <p className="text-slate-600 mb-6">
              You haven&apos;t created a profile yet. Create one to start sharing your encrypted data.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition font-medium"
              >
                Back Home
              </button>
              <button
                onClick={() => router.push('/profile/create')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-semibold"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fields: Array<{ key: keyof ProfileData; label: string; type: 'text' | 'date' | 'number' }> = [
    { key: 'email', label: FIELD_LABELS[DataField.EMAIL], type: 'text' },
    { key: 'name', label: FIELD_LABELS[DataField.NAME], type: 'text' },
    { key: 'dob', label: FIELD_LABELS[DataField.DOB], type: 'date' },
    { key: 'idNumber', label: FIELD_LABELS[DataField.ID_NUMBER], type: 'text' },
    { key: 'location', label: FIELD_LABELS[DataField.LOCATION], type: 'text' },
    { key: 'country', label: FIELD_LABELS[DataField.COUNTRY], type: 'text' },
    { key: 'experience', label: FIELD_LABELS[DataField.EXPERIENCE], type: 'number' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-sm text-slate-500 font-mono mt-1">
                  {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                </p>
              </div>
            </div>

            {!isEditMode ? (
              <div className="flex gap-3">
                <button
                  onClick={handleRevealAll}
                  disabled={revealedFields.size === 7}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {revealedFields.size === 7 ? 'All Revealed' : 'Reveal All'}
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={isSaving || loading}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || loading}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(isSaving || loading) ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {isEditMode ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 mb-2">
                <strong>⚠️ Important:</strong> Updating your profile will automatically revoke all previously granted access.
              </p>
              <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
                <li>Your updated data will be encrypted and stored on-chain</li>
                <li>All users with access to your old data will need to re-request access</li>
                <li>Revocation is handled automatically by the smart contract in a single transaction</li>
              </ul>
            </div>
          ) : revealedFields.size === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-emerald-800">
                <strong>🔒 Privacy First:</strong> All your fields are encrypted on-chain. Click individual fields or &quot;Reveal All&quot; to decrypt and view your data.
              </p>
            </div>
          ) : null}
        </div>

        {/* Profile Fields */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {field.label}
                </label>

                {isEditMode ? (
                  <input
                    type={field.type}
                    value={editedData[field.key]}
                    onChange={(e) => setEditedData({ ...editedData, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                ) : revealedFields.has(field.key) && profileData[field.key] ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="font-mono text-slate-900 flex-1">{profileData[field.key]}</span>
                    <span className="text-xs text-emerald-600 font-semibold">✓ Decrypted</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRevealField(field.key)}
                    disabled={revealingField === field.key}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl hover:bg-slate-100 hover:border-emerald-400 transition group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 text-slate-600 group-hover:text-emerald-600 transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {revealingField === field.key ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          Decrypting...
                        </span>
                      ) : (
                        '🔒 Encrypted'
                      )}
                    </span>
                    {revealingField !== field.key && (
                      <span className="text-sm text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                        Click to reveal →
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h3 className="font-semibold text-emerald-900 mb-2">🔒 Privacy & Security</h3>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• All your data is encrypted on-chain using FHEVM</li>
            <li>• Only you can decrypt and view your full profile</li>
            <li>• You control who can access specific fields</li>
            <li>• Manage access requests in your <button onClick={() => router.push('/dashboard')} className="underline font-semibold hover:text-emerald-600">Dashboard</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
