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

  if (loading) {
    return (
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="min-h-[430px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
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
                <div className="group flex min-h-[450px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {imageUrl ? (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={category.class_name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 text-sm text-slate-400">
                      Зураг оруулаагүй байна
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-3 text-lg font-bold text-slate-800">{category.class_name}</h3>

                    {subcategories.length > 0 ? (
                      <ul className="space-y-1 text-sm text-slate-600">
                        {subcategories.map((subcategory, index) => (
                          <li key={`${category.class_id}-${subcategory.subcategory_id ?? index}`} className="line-clamp-1">
                            • {subcategory.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">Дэд ангилал оруулаагүй байна</p>
                    )}

                    <div className="mt-auto pt-6">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 transition group-hover:gap-3">
                        Дэлгэрэнгүй
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!loading && categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Нүүр хуудасны ангилал бүртгэгдээгүй байна.
          </div>
        ) : null}
      </div>
    </main>
  );
}
