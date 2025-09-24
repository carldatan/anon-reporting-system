
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Logo from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import LoginLogoutButton from "@/components/ui/LoginLogoutButton"
import UserGreetText from "./UserGreetText"

const navigationLinks = [
	{ href: "/", label: "Home" },
	{ href: "#", label: "Features" },
	{ href: "#", label: "Pricing" },
	{ href: "#", label: "About" },
]

export default function Header() {
	const pathname = usePathname()

	return (
		<header className="shadow-md bg-green-primary px-4 mb-2 md:px-6">
			<div className="flex h-16 items-center justify-between gap-4">
				{/* Left side */}
				<div className="flex items-center gap-2">
					{/* Mobile menu trigger */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								className="group size-8 md:hidden"
								variant="ghost"
								size="icon"
							>
								{/* Hamburger SVG */}
							</Button>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-36 p-1 md:hidden">
							<NavigationMenu className="max-w-none *:w-full">
								<NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
									{navigationLinks.map((link, index) => (
										<NavigationMenuItem key={index} className="w-full">
											<NavigationMenuLink asChild>
												<Link
													href={link.href}
													className={`py-1.5 w-full block ${pathname === link.href
														? "text-primary font-bold"
														: "text-muted-foreground hover:text-primary"
														}`}
												>
													{link.label}
												</Link>
											</NavigationMenuLink>
										</NavigationMenuItem>
									))}
								</NavigationMenuList>
							</NavigationMenu>
						</PopoverContent>
					</Popover>

					{/* Desktop nav */}
					<div className="flex items-center gap-6">
						<Link href="/" className="text-primary hover:text-primary/90">
							<Logo />
						</Link>

						<NavigationMenu className="max-md:hidden">
							<NavigationMenuList className="gap-2">
								{navigationLinks.map((link, index) => (
									<NavigationMenuItem key={index}>
										<NavigationMenuLink asChild>
											<Link
												href={link.href}
												className={`py-1.5 font-medium ${pathname === link.href
													? "text-primary font-bold"
													: "text-muted-foreground hover:text-primary"
													}`}
											>
												{link.label}
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-2">
					<UserGreetText />
					<LoginLogoutButton />
				</div>
			</div>
		</header>
	)
}
