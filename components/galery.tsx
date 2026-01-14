"use client";

import { Space_Grotesk } from "next/font/google";
import { useState, useEffect, useMemo } from "react";
import type { GalleryContent, GalleryProject } from "@/types/content";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface GaleryProps {
    data: GalleryContent;
}

// ============================================================================
// Filter Pills Component
// ============================================================================

interface FilterPillsProps {
    tags: string[];
    activeFilter: string | null;
    onFilterChange: (tag: string | null) => void;
}

const FilterPills = ({ tags, activeFilter, onFilterChange }: FilterPillsProps) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {/* "Todos" pill */}
            <button
                onClick={() => onFilterChange(null)}
                className={`
                    ${spaceGrotesk.className}
                    px-5 py-2 rounded-full text-sm font-medium
                    transition-all duration-300
                    ${activeFilter === null
                        ? "bg-[#045B64] text-white"
                        : "bg-[#F5F5F5] text-[#2A2524] hover:bg-[#E8E8E8]"
                    }
                `}
            >
                Todos
            </button>
            
            {/* Tag pills */}
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => onFilterChange(tag)}
                    className={`
                        ${spaceGrotesk.className}
                        px-5 py-2 rounded-full text-sm font-medium
                        transition-all duration-300
                        ${activeFilter === tag
                            ? "bg-[#045B64] text-white"
                            : "bg-[#F5F5F5] text-[#2A2524] hover:bg-[#E8E8E8]"
                        }
                    `}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};

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
// Gallery Card Component - Grid Version (Always Visible Info)
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
            className="relative overflow-hidden cursor-pointer group"
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
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Gradient Overlay - Always visible */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0,0,0,0) 70%)",
                    }}
                />

                {/* Content - Always visible */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    {/* Tag */}
                    <span className="bg-[#C17F6F] w-fit text-[#020202] text-[10px] md:text-xs text-center font-medium px-4 py-1.5 rounded-full mb-3">
                        {project.tag}
                    </span>
                    
                    {/* Title */}
                    <h2
                        className={
                            spaceGrotesk.className +
                            " text-white text-xl md:text-2xl font-medium mb-3"
                        }
                    >
                        {project.title}
                    </h2>
                    
                    {/* Ver Projeto Button */}
                    <span
                        className={
                            spaceGrotesk.className +
                            " text-[#C17F6F] text-sm md:text-base font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                        }
                    >
                        Ver projeto
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            className="transition-transform group-hover:translate-x-1"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function Galery({ data }: GaleryProps) {
    const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const projects = data.projects;

    // Extract unique tags from projects
    const uniqueTags = useMemo(() => {
        const tags = projects.map((project) => project.tag);
        return [...new Set(tags)].sort();
    }, [projects]);

    // Filter projects based on active filter
    const filteredProjects = useMemo(() => {
        if (activeFilter === null) {
            return projects;
        }
        return projects.filter((project) => project.tag === activeFilter);
    }, [projects, activeFilter]);

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
                className="bg-white border-t border-[#E5E5E5] py-16 md:py-24"
            >
                <div className="max-w-[1342px] w-full mx-auto px-4 md:px-8">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center mb-12 md:mb-16">
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

                        <p className="text-md lg:text-[21.37px] text-[#181D23] text-center leading-relaxed lg:text-nowrap pb-[32px]">
                            realizamos projetos com propósito.
                        </p>
                        <p
                            className="text-md lg:text-[18px] text-[#181D23] text-center leading-relaxed max-w-[800px]"
                            style={{ lineHeight: "180%" }}
                        >
                            {data.description}
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <FilterPills
                        tags={uniqueTags}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />

                    {/* Grid - 3 items per row on desktop, 1 on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredProjects.map((project) => (
                            <GaleryCard
                                key={project.id}
                                project={project}
                                onClick={() => openProject(project)}
                            />
                        ))}
                    </div>

                    {/* Empty state when no projects match filter */}
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-16">
                            <p className={spaceGrotesk.className + " text-[#666] text-lg"}>
                                Nenhum projeto encontrado para este filtro.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
