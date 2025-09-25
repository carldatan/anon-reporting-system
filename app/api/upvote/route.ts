import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
	const { post_id } = await req.json();
	const supabase = createClient();

	const { data: { user } } = await supabase.auth.getUser();
	const user_id = user?.id

	const { error } = await supabase
		.from("post_upvotes")
		.insert({ post_id, user_id });

	if (error) return NextResponse.json({ error: error.message }, { status: 400 });

	// optional: update posts.upvotes via trigger or manually
	return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
	const { post_id } = await req.json();
	const supabase = createClient();

	const { data: { user } } = await supabase.auth.getUser();
	const user_id = user?.id

	const { error } = await supabase
		.from("post_upvotes")
		.delete()
		.eq("post_id", post_id)
		.eq("user_id", user_id);

	if (error) return NextResponse.json({ error: error.message }, { status: 400 });

	return NextResponse.json({ success: true });
}
