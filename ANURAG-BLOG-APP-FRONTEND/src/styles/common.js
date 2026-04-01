// src/styles/common.js
// Theme: Skeptic Magazine Editorial
// Focus: long-form reading, serif typography, warm paper background

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-[#f7f5f0] min-h-screen"
export const pageWrapper = "max-w-3xl mx-auto px-6 py-16"
export const section = "mb-20"

// ─── Cards ────────────────────────────────────────────
export const cardClass = "bg-white border border-[#e7e3d9] rounded-lg p-6 hover:shadow-sm transition"

// ─── Typography ───────────────────────────────────────
export const pageTitleClass =
    "font-serif text-5xl leading-tight text-[#1a1a1a] tracking-tight"

export const headingClass =
    "font-serif text-3xl text-[#1a1a1a] leading-snug"

export const subHeadingClass =
    "font-serif text-xl text-[#2b2b2b]"

export const bodyText =
    "font-serif text-[1.1rem] leading-[1.9] text-[#2f2f2f]"

export const mutedText =
    "text-sm text-[#8a8a8a]"

export const linkClass =
    "text-[#b91c1c] hover:text-[#7f1d1d] transition"

// ─── Article Reading Enhancements ─────────────────────
export const articleBody =
    "font-serif text-[#2f2f2f] text-[1.15rem] leading-[1.95] max-w-2xl mx-auto"

export const articleParagraph =
    "mb-6"

export const dropCap =
    "first-letter:float-left first-letter:text-6xl first-letter:pr-2 first-letter:leading-none first-letter:font-serif"

// ─── Article Cards ────────────────────────────────────
export const articleGrid =
    "grid grid-cols-1 md:grid-cols-2 gap-10"

export const articleCardClass =
    "bg-white border border-[#e7e3d9] rounded-lg p-6 flex flex-col gap-3 hover:shadow-sm transition"

export const articleTitle =
    "font-serif text-xl text-[#1a1a1a] leading-snug"

export const articleExcerpt =
    "text-sm text-[#444444] leading-relaxed"

export const articleMeta =
    "text-xs text-[#8a8a8a]"

export const tagClass =
    "text-[0.65rem] font-semibold text-[#b91c1c] uppercase tracking-widest"

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
    "bg-[#f7f5f0]/90 backdrop-blur border-b border-[#e7e3d9] px-8 h-[60px] flex items-center sticky top-0 z-50"

export const navContainerClass =
    "max-w-4xl mx-auto w-full flex items-center justify-between"

export const navBrandClass =
    "font-serif text-lg font-bold text-[#1a1a1a]"

export const navLinksClass =
    "flex items-center gap-8"

export const navLinkClass =
    "text-sm text-[#555555] hover:text-[#1a1a1a] transition"

export const navLinkActiveClass =
    "text-sm text-[#b91c1c] font-medium"

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
    "bg-[#b91c1c] text-white font-medium px-5 py-2 rounded-full hover:bg-[#7f1d1d] transition text-sm"

export const secondaryBtn =
    "border border-[#e7e3d9] text-[#1a1a1a] px-5 py-2 rounded-full hover:bg-[#f0eee8] transition text-sm"

export const ghostBtn =
    "text-[#b91c1c] hover:text-[#7f1d1d] transition text-sm"

// ─── Forms ────────────────────────────────────────────
export const formCard =
    "bg-white border border-[#e7e3d9] rounded-lg p-10 max-w-md mx-auto"

export const formTitle =
    "font-serif text-2xl text-[#1a1a1a] text-center mb-7"

export const labelClass =
    "text-xs text-[#6b6b6b] mb-1 block"

export const inputClass =
    "w-full bg-[#faf9f4] border border-[#e7e3d9] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#b91c1c]"

export const formGroup =
    "mb-4"

export const submitBtn =
    "w-full bg-[#b91c1c] text-white py-2.5 rounded-full hover:bg-[#7f1d1d] transition"

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
    "bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-3 text-sm"

export const successClass =
    "bg-green-50 text-green-700 border border-green-200 rounded-md px-4 py-3 text-sm"

export const loadingClass =
    "text-[#b91c1c]/70 text-sm animate-pulse text-center py-10"

export const emptyStateClass =
    "text-center text-[#9a9a9a] py-16 text-sm"

// ─── Divider ──────────────────────────────────────────
export const divider =
    "border-t border-[#e7e3d9] my-12"

// ─── Modals ───────────────────────────────────────────
export const modalOverlay =
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"

export const modalOverlayScroll =
    "fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-10 px-4"

export const modalContainer =
    "bg-[#f7f5f0] border border-[#e7e3d9] rounded-xl shadow-lg w-full max-w-2xl p-8 relative"

export const modalCloseBtn =
    "absolute top-4 right-4 text-[#8a8a8a] hover:text-[#1a1a1a] transition text-sm cursor-pointer"

export const modalFooter =
    "mt-8 flex justify-end"

// ─── Comments ─────────────────────────────────────────
export const commentCard =
    "bg-white border border-[#e7e3d9] rounded-lg px-4 py-3"

export const commentAuthor =
    "text-xs font-semibold text-[#b91c1c] mb-1"

export const commentBody =
    "text-sm text-[#2f2f2f] leading-relaxed"

export const commentList =
    "space-y-4"

export const commentForm =
    "mb-8"

// ─── Layout Helpers ───────────────────────────────────
export const pageHeaderRow =
    "flex justify-between items-center mb-8"

export const cardActionRow =
    "flex gap-2 mt-3 flex-wrap"

export const formActionRow =
    "flex gap-3 mt-2"

// ─── Article Meta ─────────────────────────────────────
export const articleAuthorLine =
    "text-xs text-[#8a8a8a] mt-1 mb-6"

export const authorNameHighlight =
    "font-semibold text-[#444]"

export const authorEmailMuted =
    "ml-1 text-[#9a9a9a]"