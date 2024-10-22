import { Project } from "../types/project";

export const projects: Project[] = [
    {
        id: 1,
        title: "Project 1",
        description: {
            en: "Description in English",
            ko: "한국어 설명",
        },
        year: "2023",
        imageUrl: "/path/to/image.jpg",
        projectUrl: "https://example.com",
    },
    // 다른 프로젝트들도 같은 방식으로 수정합니다
];
