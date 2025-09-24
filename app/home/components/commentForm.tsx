import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { threadType } from "@/types/thread";
import { reply } from "@/types/replies";
import { insertReplies } from "@/lib/db/replies";

interface CommentFormProps {
	thread: threadType; // Required - we always need the thread context
	parentReplyId?: number | null; // Optional - null for thread comments, number for reply-to-reply
	onClose?: () => void;
	onReplyAdded: (reply: reply) => void;
	onReplyRefresh: () => void;
	onReplyRemoved: (replyId: number) => void;
	placeholder?: string; // Custom placeholder text
	buttonText?: string; // Custom button text
}

export default function CommentForm({
	thread,
	parentReplyId = null,
	onClose,
	onReplyAdded,
	onReplyRefresh,
	onReplyRemoved,
	placeholder,
	buttonText = "Post Comment"
}: CommentFormProps) {
	const [comment, setComment] = useState('');
	const [submitting, setSubmitting] = useState(false);

	// Determine the context for display
	const isReplyToThread = parentReplyId === null;
	const contextName = isReplyToThread
		? thread.profiles?.username || "this thread"
		: "this reply";

	const defaultPlaceholder = isReplyToThread
		? `Comment on ${thread.profiles?.username || "this thread"}'s post...`
		: `Reply to this comment...`;

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;

		setSubmitting(true);

		// Create optimistic reply
		const tempReply: reply = {
			id: Date.now(), // Temporary ID
			content: comment,
			author: "You", // Current user - you might want to get this from auth
			created_at: new Date().toISOString(),
			parent_reply_id: parentReplyId,
			thread_id: thread.id,
		};

		// Optimistically add to UI
		onReplyAdded(tempReply);
		setComment("");

		try {
			// Submit to database
			await insertReplies(thread.id, comment, parentReplyId);

			// Refresh to get the real data from server
			onReplyRefresh();

			// Show success message
			toast.success(isReplyToThread ? 'Comment posted!' : 'Reply posted!');

			// Close the form if it's inline
			if (onClose) {
				onClose();
			}
		} catch (error) {
			console.error('Failed to submit comment:', error);

			// Remove the optimistic update on error
			onReplyRemoved(tempReply.id);

			// Show error message
			toast.error(`Failed to ${isReplyToThread ? 'post comment' : 'post reply'}`);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setComment("");
		if (onClose) {
			onClose();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Submit on Ctrl+Enter or Cmd+Enter
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			e.preventDefault();
			handleSubmitComment();
		}
	};

	return (
		<div className="mt-4 space-y-2">
			<Textarea
				className="min-h-[40px] resize-none"
				placeholder={placeholder || defaultPlaceholder}
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				onKeyDown={handleKeyDown}
				rows={4}
				disabled={submitting}
			/>

			<div className="flex justify-between items-center">
				<div className="text-xs text-gray-500">
					{isReplyToThread ? "Commenting on thread" : "Replying to comment"}
					{comment.length > 0 && (
						<span className="ml-2">• Ctrl+Enter to submit</span>
					)}
				</div>

				<div className="flex space-x-2">
					{onClose && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleCancel}
							disabled={submitting}
						>
							Cancel
						</Button>
					)}
					<Button
						size="sm"
						onClick={handleSubmitComment}
						disabled={!comment.trim() || submitting}
					>
						{submitting ? "Submitting..." : buttonText}
					</Button>
				</div>
			</div>
		</div>
	);
}
