"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface CategorySubcategory {
  subcategory_id?: number;
  name: string;
  sort_order?: number;
}

interface Category {
  class_id: number;
  class_name: string;
  description?: string;
  image_path?: string;
  sort_order?: number;
  subcategories?: CategorySubcategory[];
}

const API_BASE = 'https://shdmonitoring.ub.gov.mn';
const MAX_HOMEPAGE_CATEGORIES = 10;

function getDesktopRows(items: Category[]) {
  if (items.length <= 5) {
    return [items];
  }

  const topRowCount = Math.ceil(items.length / 2);
  return [items.slice(0, topRowCount), items.slice(topRowCount)];
}

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/class`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Categories fetch error:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const containerClassName = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
  const visibleCategories = categories.slice(0, MAX_HOMEPAGE_CATEGORIES);
  const desktopRows = getDesktopRows(visibleCategories);

  const renderCategoryCard = (category: Category) => {
    const subcategories = Array.isArray(category.subcategories) ? category.subcategories : [];
    const desc = subcategories.map((item) => item.name).join(',');
    const imageUrl = category.image_path ? `${API_BASE}/${category.image_path}` : '';

    return (
      <Link
        key={category.class_id}
        href={{
          pathname: `/news/${category.class_id}`,
          query: {
            name: category.class_name,
            desc,
          },
        }}
      >
        <div className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_24px_50px_rgba(37,99,235,0.12)]">
          {imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <Image
                src={imageUrl}
                alt={category.class_name}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw'
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/20 to-transparent" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 px-6 text-center text-sm font-medium text-slate-400">
              Зураг оруулаагүй байна
            </div>
          )}

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4">
              <h3 className="line-clamp-2 text-[1.45rem] font-semibold leading-[1.2] tracking-[-0.03em] text-slate-900 sm:text-[1.55rem] xl:text-[1.4rem]">
                {category.class_name}
              </h3>
            </div>

            {subcategories.length > 0 ? (
              <ul className="space-y-2 text-[15px] leading-6 text-slate-600">
                {subcategories.map((subcategory, index) => (
                  <li
                    key={`${category.class_id}-${subcategory.subcategory_id ?? index}`}
                    className="line-clamp-2 flex items-start gap-2"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500/80" />
                    <span>{subcategory.name}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-auto flex justify-end pt-8">
              <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.04em] text-blue-600 transition-all duration-200 group-hover:gap-2.5 group-hover:text-blue-700">
                Дэлгэрэнгүй
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <main className="py-12">
        <div className={containerClassName}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="min-h-[360px] animate-pulse rounded-[28px] border border-slate-200/80 bg-white" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      <div className={containerClassName}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:hidden">
          {visibleCategories.map(renderCategoryCard)}
        </div>

        {visibleCategories.length > 0 ? (
          <div className="hidden xl:flex xl:flex-col xl:gap-6">
            {desktopRows.map((row, index) => (
              <div
                key={`desktop-row-${index}`}
                className="grid gap-6"
                style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
              >
                {row.map(renderCategoryCard)}
              </div>
            ))}
          </div>
        ) : null}

        {!loading && visibleCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Нүүр хуудасны ангилал бүртгэгдээгүй байна.
          </div>
        ) : null}
      </div>
    </main>
  );
}
