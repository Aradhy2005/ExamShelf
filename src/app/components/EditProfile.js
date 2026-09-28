"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditProfile({
    userId,
    currentFullName,
    currentUsername,
}) {
    
    const [isEditing, setIsEditing] = useState(false);

    const [fullName, setFullName] = useState(currentFullName || "");
    const [username, setUsername] = useState(currentUsername || "");

    const [savedFullName, setSavedFullName] = useState(
        currentFullName || ""
    );

    const [savedUsername, setSavedUsername] = useState(
        currentUsername || ""
    );

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const supabase = createClient();
    const router = useRouter();

    function handleCancel() {
        setFullName(savedFullName);
        setUsername(savedUsername);
        setMessage("");
        setIsEditing(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");

        const cleanFullName = fullName.trim();
        const cleanUsername = username.trim().toLowerCase();

        // Full name validation
        if (!cleanFullName) {
            setMessage("Please enter your full name.");
            return;
        }

        // Username validation
        if (!cleanUsername) {
            setMessage("Please enter a username.");
            return;
        }

        if (cleanUsername.length < 3) {
            setMessage("Username must be at least 3 characters.");
            return;
        }

        if (cleanUsername.length > 20) {
            setMessage("Username must be 20 characters or less.");
            return;
        }

        if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
            setMessage(
                "Username can contain only lowercase letters, numbers, and underscores."
            );
            return;
        }

        setLoading(true);

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: cleanFullName,
                username: cleanUsername,
            })
            .eq("id", userId);

        if (error) {
            console.error("Profile update error:", error);

            if (error.code === "23505") {
                setMessage("That username is already taken.");
            } else {
                setMessage("Unable to update your profile. Please try again.");
            }

            setLoading(false);
            return;
        }

        setSavedFullName(cleanFullName);
        setSavedUsername(cleanUsername);

        setMessage("Profile updated successfully.");
        setLoading(false);
        setIsEditing(false);

        router.refresh();
    }

    if (!isEditing) {
        return (
            <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Profile Information
                    </h2>

                    <button
                        type="button"
                        onClick={() => {
                            setMessage("");
                            setIsEditing(true);
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Full Name
                    </p>

                    <p className="mt-1 font-medium">
                        {savedFullName || "Not set"}
                    </p>
                </div>

                <div className="mt-5">
                    <p className="text-sm text-gray-500">
                        Username
                    </p>

                    <p className="mt-1 font-medium">
                        {savedUsername || "Not set"}
                    </p>
                </div>

                {message && (
                    <p className="mt-5 text-sm text-green-600">
                        {message}
                    </p>
                )}
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 border-t border-gray-200 pt-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Edit Profile
                </h2>
            </div>

            {/* Full Name */}
            <div className="mt-6">
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                >
                    Full Name
                </label>

                <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>

            {/* Username */}
            <div className="mt-5">
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                >
                    Username
                </label>

                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter your username"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold transition hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>

            {message && (
                <p className="mt-4 text-sm text-gray-600">
                    {message}
                </p>
            )}
        </form>
    );
}