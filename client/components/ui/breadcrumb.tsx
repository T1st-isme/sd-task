import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="text-sm text-muted-foreground py-2">
            <ol className="flex space-x-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-primary"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span>{item.label}</span>
                        )}
                        {index < items.length - 1 && (
                            <span className="px-1 text-muted-foreground">
                                /
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
