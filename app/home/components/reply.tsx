import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { threadType } from "@/types/thread";
import UpvoteButton from "./upvoteButton";
import { reply } from "@/types/replies";
import CommentButton from "./commentButton";
import { ChevronDown, ChevronRight, MessageCircle } from "lucide-react";
import CommentForm from "./commentForm";

type ThreadProps = {
	replies: reply[];
	thread: threadType
	handleModal?: (selectedThread: threadType) => void;
	onReply?: (parentId: number, content: string) => void;
	onReplyUpvote?: (replyId: number) => void;
	onReplyAdded: (reply: reply) => void;
	onReplyRefresh: () => void;
	maxDepth?: number;
}

// Single Reply Component (recursive)
function SingleReply({
	reply,
	thread,
	allReplies,
	depth = 0,
	maxDepth = 5,
	onReply,
	onReplyUpvote,
	onReplyAdded,
	onReplyRefresh,
	onReplyRemoved,

}: {
	reply: reply;
	thread: threadType
	allReplies: reply[];
	depth?: number;
	maxDepth?: number;
	onReply?: (parentId: number, content: string) => void;
	onReplyUpvote?: (replyId: number) => void;
	onReplyAdded: (reply: reply) => void,
	onReplyRefresh: () => void,
	onReplyRemoved: (replyId: number) => void,

}) {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyContent, setReplyContent] = useState('');
	const [collapsed, setCollapsed] = useState(false);

	// Find child replies for this reply
	const childReplies = allReplies.filter(r => r.parent_reply_id === reply.id);
	const hasChildren = childReplies.length > 0;

	// Calculate styling based on depth
	const marginClass = depth > 0 ? 'ml-4' : '';
	const threadingClass = depth > 0 ? 'border-l-2 border-gray-200 pl-4' : '';

	const handleSubmitReply = () => {
		if (replyContent.trim() && onReply) {
			onReply(reply.id, replyContent);
			setReplyContent('');
			setShowReplyForm(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	function handleClose() {
		setShowReplyForm(false)
	}

	return (
		<div className={`${threadingClass} ${depth > 0 ? 'mt-3' : 'mb-4'}`}>
			<Card className="shadow-sm border-0 w-full">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							{hasChildren && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setCollapsed(!collapsed)}
									className="p-1 h-6 w-6"
								>
									{collapsed ? (
										<ChevronRight className="h-4 w-4" />
									) : (
										<ChevronDown className="h-4 w-4" />
									)}
								</Button>
							)}
							<div>
								<CardTitle className="text-base">{reply.author}</CardTitle>
								<CardDescription className="text-xs">
									{formatDate(reply.created_at)}
									{depth > 0 && ` • Reply level ${depth}`}
								</CardDescription>
							</div>
						</div>
						{hasChildren && (
							<span className="text-xs text-gray-500">
								{childReplies.length} {childReplies.length === 1 ? 'reply' : 'replies'}
							</span>
						)}
					</div>
				</CardHeader>

				<CardContent className="py-2">
					<p className="text-sm">{reply.content}</p>
				</CardContent>

				<CardFooter className="pt-2">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center space-x-2">
							<UpvoteButton
								key={`reply-upvote-${reply.id}`}
								initialCount={0}
								/* You'll need to implement reply upvotes */
								thread_id={reply.id} // This should probably be reply_id
								user_id={reply.author}
							/>

							{depth < maxDepth && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowReplyForm(!showReplyForm)}
									className="text-gray-500 hover:text-blue-500 text-xs"
								>
									<MessageCircle className="h-3 w-3 mr-1" />
									Reply
								</Button>
							)}
						</div>
					</div>

					{/* Reply Form */}
					{showReplyForm && (
						<CommentForm
							key={reply.id}
							parentReplyId={reply.id}
							onReplyAdded={onReplyAdded}
							onReplyRefresh={onReplyRefresh}
							onReplyRemoved={onReplyRemoved}
							onClose={handleClose}
							thread={thread}
						/>
					)}
				</CardFooter>
			</Card>

			{/* Nested Replies */}
			{hasChildren && !collapsed && (
				<div className="mt-2">
					{childReplies
						.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
						.map((childReply) => (
							<SingleReply
								key={childReply.id}
								reply={childReply}
								allReplies={allReplies}
								depth={depth + 1}
								maxDepth={maxDepth}
								onReply={onReply}
								onReplyUpvote={onReplyUpvote}
								onReplyRefresh={onReplyRefresh}
								onReplyAdded={onReplyAdded}
								thread={thread}
							/>
						))}
				</div>
			)}

			{/* Show "Continue thread" for deep nesting */}
			{depth >= maxDepth && hasChildren && (
				<div className="mt-2 ml-4">
					<Button variant="link" size="sm" className="text-blue-500 text-xs">
						Continue thread ({childReplies.length} more {childReplies.length === 1 ? 'reply' : 'replies'})
					</Button>
				</div>
			)}
		</div>
	);
}

export default function ReplyCard({
	replies,
	thread,
	handleModal,
	onReplyRefresh,
	onReplyAdded,
	onReplyUpvote,
	maxDepth = 5
}: ThreadProps) {

	// Get only top-level replies (those without a parent)
	const topLevelReplies = replies.filter(reply => reply.parent_reply_id === null);

	// Sort top-level replies by creation date
	const sortedTopLevelReplies = topLevelReplies.sort(
		(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
	);

	if (replies.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				<MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
				<p>No replies yet. Be the first to comment!</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">
					Replies ({replies.length})
				</h3>
			</div>

			{sortedTopLevelReplies.map((reply) => (
				<SingleReply
					key={reply.id}
					reply={reply}
					thread={thread}
					allReplies={replies}
					depth={0}
					maxDepth={maxDepth}
					onReplyRefresh={onReplyRefresh}
					onReplyAdded={onReplyAdded}
					onReplyUpvote={onReplyUpvote}
				/>
			))}
		</div>
	);
}
