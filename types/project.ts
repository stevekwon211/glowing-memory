export interface Project {
    id: number;
    title: string;
    description: {
        en: string;
        ko: string;
    };
    year: string;
    imageUrl: string;
    projectUrl: string;
}
