import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	// simple test: fetch your auth settings
	const { data, error } = await supabase.auth.getSession();

	if (error) {
		return NextResponse.json({ success: false, error: error.message });
	}

	return NextResponse.json({ success: true, data });
}
