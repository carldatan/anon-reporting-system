import { threadType } from '@/types/thread';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';

export default async function getPosts(): Promise<{
	data: threadType[] | null;
	error: PostgrestError | null;
}> {
	const supabase = await createClient();

	// get logged-in user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data, error } = await supabase
		.from('posts')
		.select(`
      id,
      header,
      content,
      author,
      created_at,
      profiles!inner(username),
      post_upvotes:post_upvotes(count),
      user_has_upvoted:post_upvotes(user_id)
    `)
		.eq('user_has_upvoted.user_id', user?.id ?? '') // safely filter by current user
		.order('created_at', { ascending: false });

	if (error) return { data: null, error };

	// Flatten into threadType[]
	const posts: threadType[] = (data ?? []).map((post: any) => ({
		id: post.id,
		header: post.header,
		content: post.content,
		author: post.author,
		created_at: post.created_at,
		profiles: post.profiles,
		upvoteCount: post.post_upvotes?.[0]?.count ?? 0,
		hasUpvoted: (post.user_has_upvoted?.length ?? 0) > 0,
	}));

	return { data: posts, error: null };
}
