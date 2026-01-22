import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
    id: string;
    title: string;
    subtitle: string;
    author? : string;
    coverImageUrl: string;
    disabled?: boolean;
}

export default function BookCard({
    id,
    title,
    subtitle,
    author,
    coverImageUrl,
    disabled = false,
}: BookCardProps){
    const cardContent = (
        <>
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            {coverImageUrl ? (
            <Image 
            src={coverImageUrl} 
            alt={`Cover of the book ${title}`} 
            fill 
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw" 
            />
            ):(
            <div className="flex h-full items-center justify-center text-gray-400">
                Cover
            </div>
            )}
            </div>
            <div className="p-4">
                <h3 className="text-md font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                {author && <p className="mt-2 text-xs text-gray-500">by {author}</p>}
            </div>
        </>
    );

    const className = `group block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-gray-300"
        }`;

    if (disabled) {
        return (
            <div className={className} aria-disabled={disabled}>
                {cardContent}
            </div>
        );
    }

    return (
        <Link href={`/books/${id}`} className={className} aria-disabled={disabled}>
            {cardContent}
        </Link>
    );
}

