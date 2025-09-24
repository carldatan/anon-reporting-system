import Header from "@/components/ui/header"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
