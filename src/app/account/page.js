import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProfile from "@/app/components/EditProfile";

export default async function AccountPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url, role")
        .eq("id", user.id)
        .single();

    return (
        <main className="mx-auto max-w-4xl px-6 py-16">
            <h1 className="text-3xl font-bold">
                My Account
            </h1>

            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                {/* Profile */}
                <div className="flex items-center gap-5">
                    {profile?.avatar_url && (
                        <Image
                            src={profile.avatar_url}
                            alt="Profile picture"
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                    )}

                    <div>
                        <h2 className="text-xl font-semibold">
                            {profile?.full_name || "ExamShelf User"}
                        </h2>

                        <p className="mt-1 text-gray-600">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Account Information */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <div>
                        <p className="text-sm text-gray-500">
                            Username
                        </p>

                        <p className="mt-1 font-medium">
                            {profile?.username || "Not set"}
                        </p>
                    </div>

                    <div className="mt-5">
                        <p className="text-sm text-gray-500">
                            Account Type
                        </p>

                        <p className="mt-1 font-medium capitalize">
                            {profile?.role || "buyer"}
                        </p>

                        <EditProfile
                            userId={user.id}
                            currentFullName={profile?.full_name}
                            currentUsername={profile?.username}
                        />
                        
                    </div>
                </div>
            </div>
        </main>
    );
}