'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, X } from 'lucide-react';
import {
  Genre,
  CATALOG_COUNTRIES,
  CATALOG_YEARS,
} from '@/lib/tmdb';

export type CatalogLayout = 'portrait' | 'landscape';

let currentCatalogLayout: CatalogLayout = 'portrait';
const layoutListeners = new Set<() => void>();

export function setCatalogLayout(next: CatalogLayout) {
  if (currentCatalogLayout === next) return;
  currentCatalogLayout = next;
  layoutListeners.forEach((listener) => listener());
}

function subscribeCatalogLayout(listener: () => void) {
  layoutListeners.add(listener);
  return () => {
    layoutListeners.delete(listener);
  };
}

function getCatalogLayoutSnapshot(): CatalogLayout {
  return currentCatalogLayout;
}

function getCatalogLayoutServerSnapshot(): CatalogLayout {
  return 'portrait';
}

export function useCatalogLayout(): CatalogLayout {
  return useSyncExternalStore(
    subscribeCatalogLayout,
    getCatalogLayoutSnapshot,
    getCatalogLayoutServerSnapshot
  );
}

interface SortOption {
  id: string;
  label: string;
}

interface CatalogFilterBarProps {
  baseUrl: string;
  genres: Genre[];
  activeGenreId?: string;
  activeYear?: string;
  activeCountry?: string;
  activeFilter?: string;
  sortOptions: SortOption[];
}

type OpenDropdown = 'genre' | 'year' | 'country' | 'sort' | null;

export function CatalogFilterBar({
  baseUrl,
  genres,
  activeGenreId,
  activeYear,
  activeCountry,
  activeFilter,
  sortOptions,
}: CatalogFilterBarProps) {
  const [openMenu, setOpenMenu] = useState<OpenDropdown>(null);
  const layout = useCatalogLayout();
  const barRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const buildUrl = (updates: {
    genre?: string | null;
    year?: string | null;
    country?: string | null;
    filter?: string | null;
  }) => {
    const params = new URLSearchParams();
    const nextGenre =
      updates.genre !== undefined ? updates.genre : activeGenreId;
    const nextYear = updates.year !== undefined ? updates.year : activeYear;
    const nextCountry =
      updates.country !== undefined ? updates.country : activeCountry;
    const nextFilter =
      updates.filter !== undefined ? updates.filter : activeFilter;

    if (nextFilter) params.set('filter', nextFilter);
    if (nextGenre) params.set('genre', nextGenre);
    if (nextYear) params.set('year', nextYear);
    if (nextCountry) params.set('country', nextCountry);

    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  };

  const applyFilter = (updates: {
    genre?: string | null;
    year?: string | null;
    country?: string | null;
    filter?: string | null;
  }) => {
    setOpenMenu(null);
    router.push(buildUrl(updates), { scroll: false });
  };

  const selectedGenre = genres.find((g) => g.id.toString() === activeGenreId);
  const selectedCountry = CATALOG_COUNTRIES.find(
    (c) => c.code === activeCountry
  );
  const currentSort =
    sortOptions.find((s) => s.id === activeFilter) || sortOptions[0];

  const hasActiveFilters = Boolean(activeGenreId || activeYear || activeCountry);

  return (
    <div
      ref={barRef}
      className="relative z-30 flex flex-wrap items-center justify-between gap-3 py-4"
    >
      {/* Left: Genres, Years, Countries Pill Dropdowns (Matching Image 2) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* 1. Genres Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((prev) => (prev === 'genre' ? null : 'genre'))
            }
            className={`px-4 py-2 rounded-full text-[13px] font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
              selectedGenre
                ? 'bg-sage-600/15 border-sage-500/40 text-sage-300'
                : 'bg-[#151517] hover:bg-[#1e1e22] border-white/[0.07] text-white/90'
            }`}
          >
            <span>{selectedGenre ? selectedGenre.name : 'Genres'}</span>
            <ChevronDown
              size={14}
              className={`text-white/60 transition-transform duration-200 ${
                openMenu === 'genre' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMenu === 'genre' && (
            <div className="absolute left-0 top-full mt-2 w-[290px] sm:w-[380px] max-h-[340px] overflow-y-auto custom-scrollbar bg-[#141417]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => applyFilter({ genre: null })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] text-left transition-colors cursor-pointer ${
                  !activeGenreId
                    ? 'bg-sage-600/20 text-sage-300 font-semibold'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span>All Genres</span>
                {!activeGenreId && <Check size={13} className="text-sage-400" />}
              </button>
              {genres.map((genre) => {
                const isSelected = activeGenreId === genre.id.toString();
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => applyFilter({ genre: genre.id.toString() })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sage-600/20 text-sage-300 font-semibold'
                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{genre.name}</span>
                    {isSelected && (
                      <Check size={13} className="text-sage-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Years Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((prev) => (prev === 'year' ? null : 'year'))
            }
            className={`px-4 py-2 rounded-full text-[13px] font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
              activeYear
                ? 'bg-sage-600/15 border-sage-500/40 text-sage-300'
                : 'bg-[#151517] hover:bg-[#1e1e22] border-white/[0.07] text-white/90'
            }`}
          >
            <span>{activeYear || 'Years'}</span>
            <ChevronDown
              size={14}
              className={`text-white/60 transition-transform duration-200 ${
                openMenu === 'year' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMenu === 'year' && (
            <div className="absolute left-0 top-full mt-2 w-[260px] sm:w-[320px] max-h-[320px] overflow-y-auto custom-scrollbar bg-[#141417]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50 grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => applyFilter({ year: null })}
                className={`col-span-3 flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] text-left transition-colors cursor-pointer ${
                  !activeYear
                    ? 'bg-sage-600/20 text-sage-300 font-semibold'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span>All Years</span>
                {!activeYear && <Check size={13} className="text-sage-400" />}
              </button>
              {CATALOG_YEARS.map((yr) => {
                const isSelected = activeYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => applyFilter({ year: yr })}
                    className={`flex items-center justify-center px-2.5 py-2 rounded-xl text-[12.5px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sage-600/20 text-sage-300 font-semibold'
                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Countries Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((prev) => (prev === 'country' ? null : 'country'))
            }
            className={`px-4 py-2 rounded-full text-[13px] font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
              selectedCountry
                ? 'bg-sage-600/15 border-sage-500/40 text-sage-300'
                : 'bg-[#151517] hover:bg-[#1e1e22] border-white/[0.07] text-white/90'
            }`}
          >
            <span>{selectedCountry ? selectedCountry.name : 'Countries'}</span>
            <ChevronDown
              size={14}
              className={`text-white/60 transition-transform duration-200 ${
                openMenu === 'country' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMenu === 'country' && (
            <div className="absolute left-0 top-full mt-2 w-[280px] sm:w-[360px] max-h-[340px] overflow-y-auto custom-scrollbar bg-[#141417]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => applyFilter({ country: null })}
                className={`col-span-2 flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] text-left transition-colors cursor-pointer ${
                  !activeCountry
                    ? 'bg-sage-600/20 text-sage-300 font-semibold'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span>All Countries</span>
                {!activeCountry && <Check size={13} className="text-sage-400" />}
              </button>
              {CATALOG_COUNTRIES.map((country) => {
                const isSelected = activeCountry === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => applyFilter({ country: country.code })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sage-600/20 text-sage-300 font-semibold'
                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{country.name}</span>
                    {isSelected && (
                      <Check size={13} className="text-sage-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Reset Filters Pill */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              applyFilter({ genre: null, year: null, country: null })
            }
            className="px-3.5 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.07] text-white/60 hover:text-white text-[12.5px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <X size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right: Landscape/Portrait Toggle (Image 2) + Sort Dropdown Pill */}
      <div className="flex items-center gap-2.5 ml-auto">
        <div className="flex items-center bg-[#141416] border border-white/[0.08] rounded-full p-1">
          <button
            type="button"
            onClick={() => setCatalogLayout('landscape')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              layout === 'landscape'
                ? 'bg-white/[0.14] text-white font-semibold'
                : 'text-white/55 hover:text-white'
            }`}
          >
            Landscape
          </button>
          <button
            type="button"
            onClick={() => setCatalogLayout('portrait')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              layout === 'portrait'
                ? 'bg-white/[0.14] text-white font-semibold'
                : 'text-white/55 hover:text-white'
            }`}
          >
            Portrait
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((prev) => (prev === 'sort' ? null : 'sort'))
            }
            className="px-4 py-2 rounded-full bg-[#151517] hover:bg-[#1e1e22] border border-white/[0.07] text-[13px] font-medium text-white/90 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>{currentSort?.label || 'Most popular'}</span>
            <ChevronDown
              size={14}
              className={`text-white/60 transition-transform duration-200 ${
                openMenu === 'sort' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMenu === 'sort' && (
            <div className="absolute right-0 top-full mt-2 w-[190px] bg-[#141417]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50 flex flex-col gap-0.5">
              {sortOptions.map((option) => {
                const isSelected = currentSort?.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => applyFilter({ filter: option.id })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sage-600/20 text-sage-300 font-semibold'
                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={13} className="text-sage-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
