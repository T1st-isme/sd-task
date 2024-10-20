"use client";

import { useAuth } from "@/app/hooks/useAuth";
import {
    Building2Icon,
    CalendarDaysIcon,
    DollarSignIcon,
    HomeIcon,
    UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SidebarComponent() {
    const { user } = useAuth();
    return (
        <div className="hidden border-r bg-muted/40 lg:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link
                        href="/"
                        className="flex items-center font-semibold"
                        prefetch={true}
                    >
                        <Avatar className="h-20 w-20">
                            <AvatarImage
                                src="https://res.cloudinary.com/dzyf7iccb/image/upload/f_auto,q_auto/v1/HRM/rrg6mrgkk4jghwezjgdq"
                                alt="Admin"
                            />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <span className="text-lg font-bold">HRM System</span>
                    </Link>
                </div>
                {user?.roles?.includes("admin") ? (
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-lg font-medium">
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                prefetch={false}
                            >
                                <HomeIcon className="h-4 w-4" />
                                Dashboard
                            </Link>

                            <Link
                                href="/admin/employee"
                                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary  transition-all hover:text-primary"
                                prefetch={false}
                            >
                                <UsersIcon className="h-4 w-4" />
                                User List
                            </Link>
                        </nav>
                    </div>
                ) : user?.roles?.includes("user") ? (
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-lg font-medium">
                            <Link
                                href="/"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                prefetch={false}
                            >
                                <HomeIcon className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/request"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                prefetch={false}
                            >
                                <UsersIcon className="h-4 w-4" />
                                Request
                            </Link>
                        </nav>
                    </div>
                ) : null}
                {/* <div className="mt-auto p-4">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>
                                Unlock all features and get unlimited access to
                                our support team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="sm" className="w-full">
                                Upgrade
                            </Button>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </div>
    );
}
