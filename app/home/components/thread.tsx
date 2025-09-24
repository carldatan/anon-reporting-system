import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardContent, CardHeader, CardTitle, CardFooter, } from "@/components/ui/card";
import { threadType } from "@/types/thread";
import UpvoteButton from "./upvoteButton";
import CommentButton from "./commentButton"

type ThreadProps = {
	initialThreads: threadType[],
	handleModal: (selectedThread: threadType) => void,
}

export default function Thread({ initialThreads, handleModal }: ThreadProps) {

	return (
		<>
			{initialThreads.map(thread => (
				<Card key={thread.id} className="m-2 shadow-sm border-0 w-2xl">
					<CardHeader>
						<CardTitle>{thread.header}</CardTitle>
						<CardDescription>{thread.profiles?.username ?? "Unknown"}</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{thread.content}</p>
					</CardContent>
					<CardFooter>
						<UpvoteButton
							key={thread.id}
							initialCount={thread.upvoteCount | 0}
							initialVoted={thread.hasUpvoted}
							thread_id={thread.id}
							user_id={thread.author}
						/>
						<CommentButton key={thread.id + 1}
							onClick={() => handleModal(thread)} />
					</CardFooter>
				</Card>
			))}
		</>
	);
}

