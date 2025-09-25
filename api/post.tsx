"use server"
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache'

// Remove this line - can't call async function at module level
// const userID = getUserID();

// Type that matches exactly what GetPosts returns
type PostWithProfile = {
	id: number,
	header: string,
	content: string,
	author: string,
	created_at: string,
	profiles: {
		id: string,
		username: string,
		email: string | null
	} | null
}

type createPostProps = {
	header: string,
	content: string,
}

type post = {
	id: string | number,
	header: string,
	content: string,
	created_at: string,
	author: string,
	profiles?: {
		id: string,
		username: string,
		email: string
	}
}

export async function GetPosts() {
	const supabase = createClient();
	try {
		const { data, error } = await supabase
			.from("posts")
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

		if (error) {
			console.error('Error fetching posts:', error);
			throw error;
		}

		// Transform the data to ensure profiles is a single object, not an array
		// const transformedData = (data ?? []).map(post => ({
		// 	id: post.id,
		// 	header: post.header,
		// 	content: post.content,
		// 	author: post.author,
		// 	created_at: post.created_at,
		// 	profiles: Array.isArray(post.profiles)
		// 		? (post.profiles[0] || null)
		// 		: (post.profiles || null)
		// }));

		// return data as PostWithProfile[];
		return data;
	} catch (error) {
		console.error('Error fetching posts:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch posts'
		}
	}
}

export async function createPost({ content, header }: createPostProps) {
	const supabase = await createClient();
	try {
		// Get authenticated user
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError) {
			console.error('Auth error:', authError)
			return { success: false, error: 'Authentication error' }
		}

		if (!user) {
			return { success: false, error: 'User not authenticated' }
		}

		// Validate input
		if (!header?.trim() || !content?.trim()) {
			return { success: false, error: 'Header and content are required' }
		}

		// Insert post
		const { data, error } = await supabase
			.from('posts')
			.insert([
				{
					author: user.id,
					content: content.trim(),
					header: header.trim(),
				}
			])
			.select(`
				id,
				header,
				content,
				author,
				created_at,
				profiles (
					id,
					username,
					email
				)
			`)

		if (error) {
			console.error('Database error:', error)
			return { success: false, error: error.message }
		}

		revalidatePath('/home')
		return { success: true, data: data[0] }

	} catch (error) {
		console.error('Error creating post:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create post'
		}
	}
}
