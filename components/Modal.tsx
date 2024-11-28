"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ModalContent {
    type: "writing" | "content" | "project";
    title?: string;
    imageUrl?: string;
    url?: string;
    description?: {
        en?: string;
        ko?: string;
    };
    date?: string;
    year?: string;
    projectUrl?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: ModalContent | null;
}

const Modal = ({ isOpen, onClose, content }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (isOpen && content?.type === "writing" && content?.url) {
            window.open(content.url, "_blank");
            onClose();
        }
    }, [isOpen, content, onClose]);

    if (!isOpen || content?.type === "writing") return null;

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
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "fit-content",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Media Section */}
                {content?.imageUrl && (
                    <div
                        style={{
                            position: "relative",
                            width: "auto",
                            height: "auto",
                            margin: "0 auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            src={content.imageUrl}
                            alt={content.title || ""}
                            width={800}
                            height={800}
                            style={{
                                maxWidth: "80vw",
                                maxHeight: "70vh",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                            }}
                        />
                    </div>
                )}

                {/* Content Section */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        maxWidth: content?.imageUrl ? "800px" : "500px",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
                            {content?.title && (
                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#0C0C0C",
                                        fontSize: "20px",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {content.title}
                                </h2>
                            )}
                            {(content?.date || content?.year) && (
                                <p
                                    style={{
                                        margin: 0,
                                        color: "#3C3C3C",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                        paddingBottom: "4px",
                                    }}
                                >
                                    {content.date || content.year}
                                </p>
                            )}
                        </div>
                        {content?.projectUrl && (
                            <a
                                href={content.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    margin: 0,
                                    color: "#793315",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "0.8";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                }}
                            >
                                Link
                            </a>
                        )}
                    </div>
                    {content?.description?.ko && (
                        <p
                            style={{
                                margin: 0,
                                color: "#3C3C3C",
                                fontSize: "14px",
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {content.description.ko}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
