import Thread from "./components/thread";
import PostModal from "./components/createPost";
import getPosts from "@/lib/db/getPosts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { threadType } from "@/types/thread";
import ThreadWrapper from "./components/threadWrapper";



const home = async () => {

	const { data: initialThreads, error } = await getPosts();

	if (error) {
		console.error("Query failed:", error.message);
		return <h1>Error Fetching Posts</h1>
	}
	if (!initialThreads || initialThreads.length === 0) {
		return <h1>There are no posts.</h1>
	}

	// console.log(initialThreads);


	return (
		<>
			<ThreadWrapper initialThreads={initialThreads} />
		</>
	);
}


export default home;

