import { createClient } from "@/utils/supabase/client";
import { reply } from "@/types/replies";

export async function getReplies(thread_id: number): Promise<reply[]> {
	const supabase = await createClient()
	const { data, error } = await supabase.from('replies')
		.select(`
			*,
			profiles:author(username)
		`)
		.eq('thread_id', thread_id)
		.order('created_at', { ascending: true }) // Optional: order by creation time

	if (error) {
		console.error('Error fetching replies:', error);
		throw new Error(error.message);
	}

	const replies: reply[] = (data ?? []).map((reply: any) => ({
		id: reply.id,
		content: reply.content,
		author: reply.profiles?.username ?? 'Unknown', // Now gets username instead of UUID
		created_at: reply.created_at,
		parent_reply_id: reply.parent_reply_id,
		thread_id: reply.thread_id,
	}));

	return replies;
}
export async function insertReplies(thread_id: number, content: string, parent_reply_id: number | null) {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()

	const { status, error } = await supabase.from('replies')
		.insert([{ thread_id: thread_id, author: user?.id, content: content, parent_reply_id: parent_reply_id }])
		.select()

	if (error) {
		console.error('Error fetching replies:', error);
		throw new Error(error.message); // Throw error instead of returning it
	}


	return status
}
