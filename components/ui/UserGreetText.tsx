"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
	const [username, setUsername] = useState<string | null>(null);
	const supabase = createClient();

	useEffect(() => {
		const fetchUserAndProfile = async () => {
			// 1. Get the logged-in user
			const { data: { user } } = await supabase.auth.getUser();

			if (user) {
				// 2. Fetch the username from the profiles table
				const { data: profile, error } = await supabase
					.from("profiles")
					.select("username")
					.eq("id", user.id)
					.single();

				if (error) {
					console.error("Error fetching profile:", error);
					setUsername("user"); // fallback
				} else {
					setUsername(profile?.username ?? "user");
				}
			}
		};

		fetchUserAndProfile();
	}, [supabase]);

	if (username) {
		return (
			<p className="flex items-center justify-center px-2 py-1 text-sm rounded-md border border-gray-300 bg-gray-200 dark:border-neutral-800 dark:bg-zinc-800/30">
				hello&nbsp;
				<code className="font-mono font-bold">{username}!</code>
			</p>
		);
	}

	// return (
	// 	<p className="flex items-center justify-center px-2 py-1 text-sm rounded-md border border-gray-300 bg-gray-200 dark:border-neutral-800 dark:bg-zinc-800/30">
	// 		Get started editing&nbsp;
	// 		<code className="font-mono font-bold">app/page.tsx</code>
	// 	</p>
	// );
};

export default UserGreetText;
