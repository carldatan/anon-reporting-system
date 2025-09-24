import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ReplyCard from "./reply";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { threadType } from "@/types/thread";
import { reply } from "@/types/replies";
import { insertReplies } from "@/lib/db/replies";
import { toast } from 'sonner'
import CommentForm from "./commentForm";

interface ThreadModal {
	isOpen: boolean;
	onClose: () => void;
	thread: threadType | null;
	replies: reply[]
	onReplyAdded: (reply: reply) => void,
	onReplyRefresh: () => void,
	onReplyRemoved: (replyId: number) => void,
}

export default function ThreadModal({ isOpen, onClose, thread, replies, onReplyAdded, onReplyRefresh, onReplyRemoved }: ThreadModal) {
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false)

	if (!thread) return null;

	const handleSubmitComment = async () => {
		setSubmitting(true);
		const tempReply = {
			id: Date.now(), // Temporary ID
			content: comment,
			author: "You", // Current user
			created_at: new Date().toISOString(),
			parent_reply_id: null,
			thread_id: thread.id,
		};

		// Optimistically add to UI
		onReplyAdded(tempReply);
		setComment("");

		try {
			await insertReplies(thread.id, comment, null);
			// Refresh to get the real data from server
			onReplyRefresh();
		} catch (error) {
			console.error('Failed to submit comment:', error);
			// Remove the optimistic update on error
			onReplyRemoved(tempReply.id);
			toast.error('Failed to submit comment');
		} finally {
			setSubmitting(false);
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[80vh] !max-w-4xl w-full">
				<DialogHeader>
					<DialogTitle>Add Comment</DialogTitle>
					<DialogDescription>
						Comment on this thread
					</DialogDescription>
				</DialogHeader>

				{/* Display the original thread card */}
				<Card className="mb-4">
					<CardHeader>
						<CardTitle>{thread.header}</CardTitle>
						<CardDescription>{thread.profiles?.username ?? "Unknown"}</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{thread.content}</p>
					</CardContent>
				</Card>


				{/* You can add more parent-level components here */}

				<ReplyCard
					thread={thread}
					replies={replies}
					onReplyAdded={onReplyAdded}
					onReplyRefresh={onReplyRefresh}
				/>

				{/* Comment form */}
				<CommentForm
					thread={thread}
					onReplyRemoved={onReplyRemoved}
					onReplyAdded={onReplyAdded}
					onReplyRefresh={onReplyRefresh}
				/>

				<div className="mt-6 p-4 bg-gray-50 rounded-lg">
					<h4 className="font-semibold mb-2">Thread Stats</h4>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-600">Upvotes: </span>
							<span className="font-medium">{thread.upvoteCount}</span>
						</div>
						<div>
							<span className="text-gray-600">Author: </span>
							<span className="font-medium">{thread.profiles?.username ?? "Unknown"}</span>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
