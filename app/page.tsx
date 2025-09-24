"use client"
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

export default function Home() {
	return (
		<div className="">
			<Toaster />
			<div className="pb-20 md:pb-36">
				<Header />
			</div>
			<div className="relative text-center ">
				<h1 className="mx-auto max-w-2xl text-balance text-4xl font-bold md:text-5xl mb-1">A Safe Space to Share. Report Concerns Without Fear of Retaliation.</h1>
				<p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-xl">See Something? Say Something. Your Report is Anonymous.</p>
				<div className="flex flex-col items-center justify-center *:w-full sm:flex-row sm:*:w-auto">

					<Button size="lg" className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gold text-primary-foreground hover:brightness-95 h-11 px-6 font-medium text-base" >Get Started</Button>
				</div>
			</div>
		</div>
	);
}
