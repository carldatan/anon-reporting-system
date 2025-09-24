import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const router = useRouter();

export default function ErrorPage({ searchParams }: { searchParams: { reason?: string } }) {
	return (
		<div className="p-8 text-center">
			<h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
			<p className="mt-4">
				{searchParams.reason === "invalid-domain"
					? "You must sign in with a valid organization email."
					: "An error occurred."}
			</p>

			<Button onClick={() => router.push("/")}>Go Back to home page</Button>

		</div>
	);
}
