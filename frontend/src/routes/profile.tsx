import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {useEffect} from 'react';

export const Route = createFileRoute('/profile')({
  component: Profile,
});

function Profile() {
    const [displayName, setDisplayName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [email, setEmail] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    const[newPassword, setNewPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');

    const[success, setSuccess] = useState('');
    const[error, setError] = useState('');
    const[loading, setLoading] = useState(false);

const loadProfile = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/auth/profile"
    );

    const result = await response.json();

    if (!response.ok) {
      setError('Failed to load profile');
      return;
    }

    setEmail(result.email);
    setCreatedAt(result.created_at);
    setDisplayName(result.display_name || "");

  } catch {
    setError("Unable to load profile.");
  }
};
  
    useEffect(() => {
      loadProfile();
    }, []);

    const handleSaveProfile= async () => {
    console.log("Save button clicked");

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/auth/update_profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: displayName,
        }),
      }
    );

    console.log("Response:", response);

    setSuccess('Profile updated successfully!');
   } catch {
    setError('Failed to update profile. Please try again.');
   } finally {
    setLoading(false);
    }
    };
const handleChangePassword = async () => {
  setError('');
  setSuccess('');

  if (newPassword !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/auth/change_password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: newPassword,
        }),
      }
    );

    const result = await response.json();

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Password changed successfully!");
  } catch {
    setError("Failed to change password.");
  } finally {
    setLoading(false);
  }
};

  return(
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#81A3F8] to-[#F0F3FE] px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-6 text-center text-3xl font-bold">
         User Profile
    </h1>

      <div className="mb-6 flex justify-center">
       < div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
       
        { displayName? displayName.charAt(0).toUpperCase()  : 'U'}
        </div>

        </div>
        {success && (
          <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
         <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">
            Account Information
          </h2>

          <p className="mb-2">
          <strong>Email:</strong> {email || 'Not Available'}
          </p>

          <p>
           <strong>Account Created:</strong> {createdAt || 'Not Available'}
        </p>
        </div>

          <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">
            Display Name
          </h2>

          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            className="mb-4 w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"/>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400"
            >
            Save Changes
          </button>
        </div>

        <div className = "space-y-4">
          <h2 className="mb-4 text-xl font-semibold">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mb-3 w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"/>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-3 w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"/>

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none" />


          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Update Password
          </button>
        </div>

      </div>
    </main>
  )


  }