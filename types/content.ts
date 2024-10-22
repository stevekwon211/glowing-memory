export interface ContentItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    link: string;
    category: string;
    type: "image" | "video";
}
