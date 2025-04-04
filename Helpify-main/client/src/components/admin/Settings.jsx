import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faBell,
  faEnvelope,
  faLock,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
    appearance: {
      theme: 'light',
      language: 'en',
    },
  });

  const handleToggle = (category, setting) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Notifications Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faBell}
            className="text-blue-600 text-xl mr-3"
          />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.notifications.email
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-500">
                Receive push notifications
              </p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'push')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.notifications.push
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-500">
                Receive notifications via SMS
              </p>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'sms')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faLock}
            className="text-blue-600 text-xl mr-3"
          />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">
                Add an extra layer of security
              </p>
            </div>
            <button
              onClick={() => handleToggle('security', 'twoFactorAuth')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.security.twoFactorAuth
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <p className="font-medium mb-2">Session Timeout (minutes)</p>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  security: {
                    ...prev.security,
                    sessionTimeout: parseInt(e.target.value),
                  },
                }))
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="120">120</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faGlobe}
            className="text-blue-600 text-xl mr-3"
          />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Theme</p>
            <select
              value={settings.appearance.theme}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  appearance: {
                    ...prev.appearance,
                    theme: e.target.value,
                  },
                }))
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <p className="font-medium mb-2">Language</p>
            <select
              value={settings.appearance.language}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  appearance: {
                    ...prev.appearance,
                    language: e.target.value,
                  },
                }))
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;
