import Image from "next/image";
import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: {
        type: "taste" | "writing" | "artifact";
        title?: string;
        imageUrl?: string;
        url?: string;
        description?: {
            en?: string;
            ko?: string;
        };
        date?: string;
        year?: string;
    };
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
        if (isOpen && content.type === "writing" && content.url) {
            window.open(content.url, "_blank");
            onClose();
        }
    }, [isOpen, content, onClose]);

    if (!isOpen || content.type === "writing") return null;

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
                    width: "fit-content",
                    maxWidth: "800px",
                    maxHeight: "90vh",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Media Section */}
                {content.imageUrl && (
                    <div
                        style={{
                            position: "relative",
                            width: "fit-content",
                            maxWidth: "100%",
                            margin: "0 auto",
                        }}
                    >
                        <Image
                            src={content.imageUrl}
                            alt={content.title || ""}
                            width={600}
                            height={400}
                            style={{
                                width: "auto",
                                height: "auto",
                                maxWidth: "100%",
                                maxHeight: "60vh",
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
                        width: "fit-content",
                        minWidth: "200px",
                    }}
                >
                    {content.title && (
                        <h2
                            style={{
                                margin: 0,
                                color: "#0C0C0C",
                                fontSize: "20px",
                                width: "fit-content",
                            }}
                        >
                            {content.title}
                        </h2>
                    )}
                    {content.description?.ko && (
                        <p
                            style={{
                                margin: 0,
                                color: "#3C3C3C",
                                fontSize: "14px",
                                width: "fit-content",
                            }}
                        >
                            {content.description.ko}
                        </p>
                    )}
                    {(content.date || content.year) && (
                        <p
                            style={{
                                margin: 0,
                                color: "#3C3C3C",
                                fontSize: "12px",
                                width: "fit-content",
                            }}
                        >
                            {content.date || content.year}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
