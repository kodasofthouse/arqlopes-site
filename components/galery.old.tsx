"use client";

import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { useState, useEffect } from "react";
import type { GalleryContent, GalleryProject } from "@/types/content";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface GaleryProps {
    data: GalleryContent;
}

// ============================================================================
// Project Overlay Component
// ============================================================================

interface ProjectOverlayProps {
    project: GalleryProject;
    onClose: () => void;
}

const ProjectOverlay = ({ project, onClose }: ProjectOverlayProps) => {
    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.classList.add("overlay-open");
        document.body.style.top = `-${scrollY}px`;
        
        return () => {
            document.body.classList.remove("overlay-open");
            document.body.style.top = "";
            window.scrollTo(0, scrollY);
        };
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const allImages = [project.image, ...(project.images || [])];
    const ts = project.technicalSheet;

    return (
        <div className="fixed inset-0 z-50 bg-white flex" style={{ overflow: "hidden" }}>
            {/* Images - scrollable */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                {allImages.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`${project.title} - ${idx + 1}`}
                        className={`w-full h-auto ${idx > 0 ? "mt-4" : ""}`}
                    />
                ))}
            </div>

            {/* Sidebar */}
            <div className="w-[280px] lg:w-[300px] border-l border-[#E8E8E8] flex flex-col flex-shrink-0" style={{ overflow: "hidden" }}>
                <div className="flex items-start justify-between p-4 pb-0">
                    <div>
                        <h2 className={spaceGrotesk.className + " text-[#2A2524] text-lg font-medium"}>
                            {project.title}
                        </h2>
                        <span className="text-[#888] text-[11px]">{project.tag}</span>
                    </div>
                    <button onClick={onClose} className="hover:opacity-60 ml-2 mt-1" aria-label="Fechar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A2524" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="px-4 pb-6">

                    {ts?.description && (
                        <p className="text-[#666] text-[11px] leading-relaxed mt-3 mb-3">
                            {ts.description}
                        </p>
                    )}

                    {ts && (
                        <>
                            <hr className="border-[#E8E8E8]" />
                            <table className="w-full text-[12px] mt-3">
                                <tbody>
                                    {ts.location && (
                                        <tr><td className="text-[#999] py-1 pr-3">Local</td><td className="text-[#2A2524] py-1">{ts.location}</td></tr>
                                    )}
                                    {ts.area && (
                                        <tr><td className="text-[#999] py-1 pr-3">Área</td><td className="text-[#2A2524] py-1">{ts.area}</td></tr>
                                    )}
                                    {ts.year && (
                                        <tr><td className="text-[#999] py-1 pr-3">Ano</td><td className="text-[#2A2524] py-1">{ts.year}</td></tr>
                                    )}
                                    {ts.client && (
                                        <tr><td className="text-[#999] py-1 pr-3">Cliente</td><td className="text-[#2A2524] py-1">{ts.client}</td></tr>
                                    )}
                                    {ts.architect && (
                                        <tr><td className="text-[#999] py-1 pr-3">Projeto</td><td className="text-[#2A2524] py-1">{ts.architect}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {!ts && <p className="text-[#999] text-[12px] mt-4">Informações em breve.</p>}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Gallery Card Component
// ============================================================================

const GaleryCard = ({
    project,
    onClick,
}: {
    project: GalleryProject;
    onClick: () => void;
}) => {
    return (
        <div
            className="flex w-full relative group transition-transform duration-300 hover:scale-[1.01] z-10 hover:z-20 cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div
                className="absolute inset-0 flex items-end left-0 pl-[36px] pb-[46px] 
                    opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"
            >
                <div className="flex flex-col items-start">
                    <h2
                        className={
                            spaceGrotesk.className +
                            " text-[#C17F6F] text-[28px] md:text-[34px] font-medium pb-2"
                        }
                    >
                        {project.title}
                    </h2>
                    <span className="bg-[#C17F6F] w-[140px] md:w-[160px] text-[#020202] text-xs text-center font-medium py-2 rounded-full mb-6 md:mb-[51px]">
                        {project.tag}
                    </span>
                    <span
                        className={
                            spaceGrotesk.className +
                            " relative text-white text-[16px] md:text-[18px] font-medium"
                        }
                    >
                        <span className="relative inline-flex items-start gap-2">
                            <span className="mb-2">Ver projeto</span>
                            <span
                                className="absolute left-0 bottom-0"
                                style={{
                                    width: "75%",
                                    height: "2px",
                                    background: "currentColor",
                                    borderRadius: "1px",
                                    display: "block",
                                }}
                                aria-hidden="true"
                            />
                        </span>
                    </span>
                </div>
            </div>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(20deg, rgba(0, 0, 0, 0.65) 0%, rgba(0,0,0,0) 35%)",
                }}
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default function Galery({ data }: GaleryProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
    const projects = data.projects;

    const openProject = (project: GalleryProject) => {
        setSelectedProject(project);
    };

    const closeProject = () => {
        setSelectedProject(null);
    };

    return (
        <>
            {/* Project Overlay */}
            {selectedProject && (
                <ProjectOverlay
                    project={selectedProject}
                    onClose={closeProject}
                />
            )}

            <section
                id="galery"
                className="flex bg-white border-t border-[#E5E5E5] flex-col items-center justify-center h-[1460px]"
            >
                <div className="max-w-[1342px] w-full mx-auto lg:my-[226.86px] items-center flex flex-col justify-center">
                    <div className="flex items-center">
                        <div className="flex flex-col flex-1 items-center justify-center">
                            <h1
                                className={
                                    spaceGrotesk.className +
                                    " text-2xl text-[#2A2524] lg:text-[50px] font-medium lg:text-nowrap pb-[32px] text-center"
                                }
                                style={{ lineHeight: "108%" }}
                            >
                                {data.title}
                            </h1>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/common/handwrite-construir.svg"
                                alt={`Texto manuscrito: ${data.subtitle}`}
                                className="mx-auto lg:-mt-[86px] w-[350px] lg:w-[650px] -mt-[66px] lg:-mb-[26px] -mb-[10px]"
                            />

                            <p className="text-md lg:text-[21.37px] text-[#181D23] text-center leading-relaxed lg:text-nowrap pb-[58px]">
                                realizamos projetos com propósito.
                            </p>
                            <p
                                className=" text-md lg:text-[18px] text-[#181D23] text-center leading-relaxed lg:text-nowrap pb-[58px] lg:px-0 px-8"
                                style={{ lineHeight: "180%" }}
                            >
                                {data.description}
                            </p>
                        </div>
                    </div>

                    <div className="h-[867.63px] w-full hidden md:flex">
                        <div className="relative w-full h-full flex items-center">
                            <div className="absolute bottom-[62px] right-[62px] flex items-center justify-center gap-4">
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            prev === 0
                                                ? projects.length - 3
                                                : prev - 1
                                        )
                                    }
                                    className="z-30 bg-[#045B64] rounded-full h-[75px] w-[75px] flex items-center justify-center transition-all border border-transparent hover:border-white"
                                    aria-label="Anterior"
                                    type="button"
                                >
                                    <Image
                                        src="/icons/arrow-left-icon.svg"
                                        alt="Seta para a esquerda"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            prev >= projects.length - 3
                                                ? 0
                                                : prev + 1
                                        )
                                    }
                                    className="z-30 bg-[#045B64] rounded-full p-3 h-[75px] w-[75px] flex items-center justify-center transition-all border border-transparent hover:border-white"
                                    aria-label="Próximo"
                                    type="button"
                                >
                                    <Image
                                        src="/icons/arrow-right-icon.svg"
                                        alt="Seta para a direita"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                            </div>

                            <div className="flex flex-row w-full h-full justify-center">
                                {projects.slice(
                                    currentIndex,
                                    currentIndex + 3
                                ).map((project, idx) => (
                                    <GaleryCard
                                        key={project.id + idx}
                                        project={project}
                                        onClick={() => openProject(project)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden w-full px-4 relative ">
                        <div className="w-full h-full relative flex items-center justify-center">
                            <div className="absolute bottom-[50%] w-full flex items-center justify-between px-4 z-30">
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            prev === 0
                                                ? projects.length - 1
                                                : prev - 1
                                        )
                                    }
                                    className="bg-[#045B64] rounded-full h-[50px] w-[50px] flex items-center justify-center border border-transparent hover:border-white transition-all"
                                    aria-label="Anterior"
                                    type="button"
                                >
                                    <Image
                                        src="/icons/arrow-left-icon.svg"
                                        alt="Seta para a esquerda"
                                        width={20}
                                        height={20}
                                    />
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            prev === projects.length - 1
                                                ? 0
                                                : prev + 1
                                        )
                                    }
                                    className="bg-[#045B64] rounded-full h-[50px] w-[50px] flex items-center justify-center border border-transparent hover:border-white transition-all"
                                    aria-label="Próximo"
                                    type="button"
                                >
                                    <Image
                                        src="/icons/arrow-right-icon.svg"
                                        alt="Seta para a direita"
                                        width={20}
                                        height={20}
                                    />
                                </button>
                            </div>
                            <GaleryCard
                                project={projects[currentIndex]}
                                onClick={() => openProject(projects[currentIndex])}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
