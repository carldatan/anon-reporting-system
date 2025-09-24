import { Database } from "./database.types"
// types/thread.ts
export type threadType = {
	id: number;
	header: string;
	content: string;
	author: string;
	created_at: string;
	profiles: {
		username: string | null
	} | null;

	// new fields
	upvoteCount: number | 0;
	hasUpvoted: boolean;
};
