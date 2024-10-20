"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { Navbar } from "flowbite-react";
import {
    Bell,
    Github,
    Key,
    LifeBuoy,
    Loader2,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Search,
    Settings,
    UserIcon,
    UserPlus,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function NavbarComponent({ title }: { title: string }) {
    const { loading, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                </div>
            ) : (
                <Navbar fluid rounded>
                    <Navbar.Brand>
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            {title}
                        </span>
                    </Navbar.Brand>
                    <div className="flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <button className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <Plus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        {user && (
                            <div className="ml-4 flex items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <div className="flex items-center cursor-pointer">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src="https://res.cloudinary.com/dzyf7iccb/image/upload/f_auto,q_auto/v1/posts/l02wmwjidplt1mbzonwr"
                                                    alt="User Avatar"
                                                />
                                            </Avatar>
                                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {user.username}
                                            </span>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>
                                            My Account
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <Link href="/profile">
                                                <DropdownMenuItem>
                                                    <UserIcon className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                    <DropdownMenuShortcut>
                                                        ⇧⌘P
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/enable-2fa">
                                                <DropdownMenuItem>
                                                    <Key className="mr-2 h-4 w-4" />
                                                    <span>Enable 2FA</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem>
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Settings</span>
                                                <DropdownMenuShortcut>
                                                    ⌘S
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>Team</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    <span>Invite users</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            <span>Email</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            <span>Message</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <PlusCircle className="mr-2 h-4 w-4" />
                                                            <span>More...</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Github className="mr-2 h-4 w-4" />
                                            <span>
                                                <Link href="https://github.com/T1st-isme">
                                                    GitHub
                                                </Link>
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <LifeBuoy className="mr-2 h-4 w-4" />
                                            <span>Support</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                            <DropdownMenuShortcut>
                                                ⇧⌘Q
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </Navbar>
            )}
        </>
    );
}
