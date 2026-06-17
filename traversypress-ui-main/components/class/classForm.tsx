'use client';

import * as z from 'zod';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, ImagePlus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  class_name: z.string().min(1, { message: 'Ангиллын нэр оруулна уу' }),
  description: z.string().optional(),
  sort_order: z.coerce.number().min(0, { message: '0 эсвэл түүнээс их утга оруулна уу' }),
  image_path: z.string().optional(),
  subcategories: z.array(
    z.object({
      name: z.string().min(1, { message: 'Дэд ангиллын нэр оруулна уу' }),
    })
  ),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface ClassFormProps {
  mode?: 'create' | 'edit';
  classId?: string;
}

interface CategoryResponse {
  class_id: number;
  class_name: string;
  description?: string | null;
  image_path?: string | null;
  sort_order?: number | null;
  subcategories?: { name?: string | null }[];
}

const API_BASE = 'https://shdmonitoring.ub.gov.mn';

function toFormValues(data: CategoryResponse): CategoryFormValues {
  return {
    class_name: data.class_name ?? '',
    description: data.description ?? '',
    sort_order: Number(data.sort_order ?? 0),
    image_path: data.image_path ?? '',
    subcategories:
      Array.isArray(data.subcategories) && data.subcategories.length > 0
        ? data.subcategories.map((item) => ({ name: item?.name ?? '' }))
        : [{ name: '' }],
  };
}

export default function ClassForm({ mode = 'create', classId }: ClassFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_name: '',
      description: '',
      sort_order: 0,
      image_path: '',
      subcategories: [{ name: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'subcategories',
  });

  useEffect(() => {
    if (mode !== 'edit' || !classId) {
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        let data: CategoryResponse | null = null;

        const detailRes = await fetch(`${API_BASE}/api/class/${classId}`);

        if (detailRes.ok) {
          data = await detailRes.json();
        } else {
          // Backend шинэ route сервер дээр хараахан update болоогүй үед жагсаалтаас нөхөж олно
          const listRes = await fetch(`${API_BASE}/api/class`);
          if (listRes.ok) {
            const list = await listRes.json();
            if (Array.isArray(list)) {
              data =
                list.find((item: CategoryResponse) => Number(item.class_id) === Number(classId)) ?? null;
            }
          }
        }

        if (!data) {
          throw new Error('Ангиллын мэдээлэл ачаалж чадсангүй');
        }

        const nextValues = toFormValues(data);
        form.reset(nextValues);
        setPreviewUrl(nextValues.image_path ? `${API_BASE}/${nextValues.image_path}` : '');
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : 'Серверийн алдаа',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [classId, form, mode, toast]);

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImage(file);

    if (!file && !form.getValues('image_path')) {
      setPreviewUrl('');
    }
  };

  const uploadImageIfNeeded = async () => {
    if (!selectedImage) {
      return form.getValues('image_path') ?? '';
    }

    const imageFormData = new FormData();
    imageFormData.append('image', selectedImage);

    const uploadRes = await fetch(`${API_BASE}/api/class/upload-image`, {
      method: 'POST',
      body: imageFormData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(errorText || 'Зураг upload хийхэд алдаа гарлаа');
    }

    const uploaded = await uploadRes.json();
    return uploaded.image_path ?? '';
  };

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsSubmitting(true);

      const image_path = await uploadImageIfNeeded();
      const payload = {
        class_id: classId,
        class_name: values.class_name.trim(),
        description: values.description?.trim() ?? '',
        image_path,
        sort_order: values.sort_order,
        subcategories: values.subcategories
          .map((item) => ({ name: item.name.trim() }))
          .filter((item) => item.name),
      };

      const res = await fetch(`${API_BASE}/api/class/${mode === 'edit' ? 'edit' : 'create'}`, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const responseJson = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(responseJson?.error || 'Хадгалахад алдаа гарлаа');
      }

      toast({
        title: mode === 'edit' ? 'Ангилал амжилттай шинэчлэгдлээ' : 'Ангилал амжилттай нэмэгдлээ',
      });

      if (mode === 'create') {
        form.reset({
          class_name: '',
          description: '',
          sort_order: 0,
          image_path: '',
          subcategories: [{ name: '' }],
        });
        replace([{ name: '' }]);
        setSelectedImage(null);
        setPreviewUrl('');
      }

      router.push('/admin/class');
      router.refresh();
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'Серверийн алдаа',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='border-slate-200 shadow-sm'>
      <CardHeader>
        <CardTitle className='text-xl text-slate-800'>
          {mode === 'edit' ? 'Нүүр хуудасны ангилал засах' : 'Нүүр хуудасны ангилал нэмэх'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='py-10 text-sm text-slate-500'>Ачаалж байна...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]'>
                <div className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='class_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ангиллын нэр</FormLabel>
                        <FormControl>
                          <Input className='bg-slate-50' placeholder='Жишээ: Авто зам болон зогсоол' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Товч тайлбар</FormLabel>
                        <FormControl>
                          <Textarea
                            className='min-h-[90px] bg-slate-50'
                            placeholder='Admin дотор харагдах нэмэлт тайлбар'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='sort_order'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дараалал</FormLabel>
                        <FormControl>
                          <Input type='number' min={0} className='bg-slate-50' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                  <div className='space-y-2'>
                    <FormLabel>Категорийн зураг</FormLabel>
                    <label className='flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-600 transition hover:border-blue-400 hover:text-blue-700'>
                      <ImagePlus className='h-4 w-4' />
                      <span>Зураг сонгох</span>
                      <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                    </label>
                  </div>

                  {previewUrl ? (
                    <div className='overflow-hidden rounded-xl border border-slate-200 bg-white'>
                      <img
                        src={previewUrl}
                        alt='Category preview'
                        className='h-52 w-full object-cover'
                      />
                    </div>
                  ) : (
                    <div className='flex h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400'>
                      Зураг оруулаагүй байна
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-base font-semibold text-slate-800'>Дэд ангиллууд</h3>
                    <p className='text-sm text-slate-500'>Нүүр хуудасны card дотор харагдах жагсаалт</p>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => append({ name: '' })}
                    className='gap-2'
                  >
                    <Plus className='h-4 w-4' />
                    Дэд ангилал нэмэх
                  </Button>
                </div>

                <div className='space-y-3'>
                  {fields.map((field, index) => (
                    <div key={field.id} className='flex items-start gap-3'>
                      <FormField
                        control={form.control}
                        name={`subcategories.${index}.name`}
                        render={({ field: subField }) => (
                          <FormItem className='flex-1'>
                            <FormControl>
                              <Input
                                className='bg-slate-50'
                                placeholder={`Дэд ангилал ${index + 1}`}
                                {...subField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => {
                          if (fields.length === 1) {
                            form.setValue(`subcategories.${index}.name`, '');
                            return;
                          }
                          remove(index);
                        }}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button className='w-full gap-2 bg-blue-600 hover:bg-blue-700' disabled={isSubmitting}>
                {isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
                {mode === 'edit' ? 'Өөрчлөлт хадгалах' : 'Ангилал хадгалах'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
