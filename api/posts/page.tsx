import { createClient } from '@/utils/supabase/server';

export default async function getPosts() {
	const supabase = await createClient();

	const response = await supabase.from("posts")
		.select(`
      id,
      header,
      content,
      author,
      created_at,
	upvotes,
      profiles!posts_author_fkey (
        id,
        username,
        email
      )
    `,)
		.order("created_at", { ascending: false });

	return response

}
