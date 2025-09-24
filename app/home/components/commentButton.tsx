import { FaRegComment } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { threadType } from "@/types/thread";

type CommentButtonProps = {
	onClick: () => void;
}

export default function CommentButton({ onClick }: CommentButtonProps) {

	return (
		<div>
			<Button
				onClick={onClick}
				variant="ghost"
				className="hover:cursor-pointer inline-flex mx-2 p-0">
				<FaRegComment className="mx-2" />
			</Button>
		</div>
	)

}
