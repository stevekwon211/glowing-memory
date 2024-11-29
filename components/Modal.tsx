"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ModalContent {
    type: "writing" | "content" | "project" | "artifact";
    title?: string;
    imageUrl?: string;
    url?: string;
    description?: string | { en?: string; ko?: string };
    date?: string;
    year?: string;
    category?: string | string[];
    projectUrl?: string;
    group?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: ModalContent | null;
}

const Modal = ({ isOpen, onClose, content }: ModalProps) => {
    useEffect(() => {
        if (isOpen && content?.type === "writing") {
            const script = document.createElement("script");
            script.src = "https://substack.com/embedjs/embed.js";
            script.async = true;
            script.charset = "utf-8";
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [isOpen, content]);

    if (!isOpen || !content) return null;

    const description = typeof content.description === "object" ? content.description.ko : content.description;

    if (content.type === "writing" && content.url) {
        return (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        backgroundColor: "#EFEFEF",
                        border: "1px solid #DCDCDC",
                        padding: "20px",
                        width: "500px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="substack-post-embed"
                        style={{
                            borderRadius: "12px", // 섭스택 임베드 radius 제거
                            overflow: "hidden", // 내부 요소들의 radius도 제거
                        }}
                    >
                        <p lang="en">{content.title}</p>
                        <p></p>
                        <a data-post-link href={content.url} style={{ borderRadius: "0px" }}>
                            Read on Substack
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (content.type === "artifact" || content.group === "artifact") {
        return (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        backgroundColor: "#EFEFEF",
                        border: "1px solid #DCDCDC",
                        padding: "20px",
                        maxWidth: content.imageUrl ? "800px" : "500px",
                        width: content.imageUrl ? "800px" : "auto",
                        maxHeight: "90vh",
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {content.imageUrl && (
                        <div style={{ position: "relative", width: "100%", height: "auto" }}>
                            <Image
                                src={content.imageUrl}
                                alt={content.title || ""}
                                width={800}
                                height={800}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "70vh",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    )}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "16px",
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: "12px", color: "#0C0C0C", flex: 1 }}>{content.title}</h2>
                        {content.projectUrl && (
                            <a
                                href={content.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#3C3C3C",
                                    textDecoration: "none",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                }}
                            >
                                Link
                            </a>
                        )}
                    </div>
                    {description && (
                        <p
                            style={{
                                margin: 0,
                                fontSize: "12px",
                                color: "#3C3C3C",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                width: "100%",
                            }}
                        >
                            {description}
                        </p>
                    )}
                    {(content.date || content.year) && (
                        <p style={{ margin: 0, fontSize: "12px", color: "#3C3C3C" }}>{content.date || content.year}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "#EFEFEF",
                    border: "1px solid #DCDCDC",
                    padding: "20px",
                    maxWidth: content.imageUrl ? "800px" : "500px",
                    width: content.imageUrl ? "800px" : "auto",
                    maxHeight: "90vh",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {content.type === "writing" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <h2 style={{ margin: 0, fontSize: "12px", color: "#0C0C0C" }}>{content.title}</h2>
                        <p style={{ margin: 0, fontSize: "12px", color: "#3C3C3C" }}>{content.date}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#3C3C3C" }}>
                            {Array.isArray(content.category) ? content.category.join(", ") : content.category}
                        </p>
                        {content.url && (
                            <button
                                style={{
                                    padding: "8px",
                                    background: "#EFEFEF",
                                    border: "none",
                                    fontSize: "12px",
                                    color: "#3C3C3C",
                                    cursor: "pointer",
                                    marginTop: "12px",
                                }}
                                onClick={() => window.open(content.url, "_blank")}
                            >
                                링크 열기
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {content.imageUrl && (
                            <div style={{ position: "relative", width: "100%", height: "auto" }}>
                                <Image
                                    src={content.imageUrl}
                                    alt={content.title || ""}
                                    width={800}
                                    height={800}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: "70vh",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                width: "100%",
                            }}
                        >
                            <h2 style={{ margin: 0, fontSize: "12px", color: "#0C0C0C" }}>{content.title}</h2>
                            {description && (
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "12px",
                                        color: "#3C3C3C",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        width: "100%",
                                    }}
                                >
                                    {description}
                                </p>
                            )}
                            {(content.date || content.year) && (
                                <p style={{ margin: 0, fontSize: "12px", color: "#3C3C3C" }}>
                                    {content.date || content.year}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;
