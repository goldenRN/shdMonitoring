'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';
import * as z from 'zod';
import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
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
import { useToast } from '@/components/ui/use-toast'; 2

const formSchema = z.object({
  dist: z.string().min(1, {
    message: 'Дүүрэг сонгон уу',
  }),
  khoroo: z.string().min(1, {
    message: 'Хороо оруулна уу',
  }),
});

interface KhorooEditPageProps {
  params: {
    id: string;
  };
}

const KhorooEditPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const dist = searchParams.get('dist');
  const id = params.id


  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);

  // district жагсаалт татах
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/khoroo/districts');
        const data = await res.json();
        console.log("data==", data);
        setDistricts(data);
      } catch (err) {
        console.error('District fetch алдаа:', err);
      }
    };

    fetchDistricts();

  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dist: dist || '',
      khoroo: name || '',
    },
  });
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const districtsId = districts.find((dist) => dist.name === data.dist)?.id;
    console.log("dataбббббб==", districtsId);
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/khoroo/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          district: districtsId,
          khoroo: data.khoroo,
        }),
      });

      if (res.ok) {
        toast({ title: 'Мэдээлэл амжилттай шинэчлэгдлээ' });
        form.reset();
      } else {
        toast({ title: 'Алдаа гарлаа', variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Холболтын алдаа', variant: 'destructive' });
    }
  };

  return (
    <>
      <BackButton text='Буцах' link='/admin/khoroo' />
      <h3 className='text-2xl mb-4'>Мэдээлэл шинэчлэх</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
          {/* Дүүрэг select */}
          <FormField
            control={form.control}
            name='dist'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                  Дүүрэг
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value || ''}
                    className="w-full h-10 rounded-md bg-slate-100 dark:bg-slate-500 border-0 focus:ring-0 text-black dark:text-white px-3"
                  >
                    <option value="" disabled>Сонгох</option>
                    {districts.map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Хороо input */}
          <FormField
            control={form.control}
            name='khoroo'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                  Хороо
                </FormLabel>
                <FormControl>
                  <Textarea
                    className='bg-slate-100 dark:bg-slate-500 border-0 focus:ring-0 text-black dark:text-white'
                    placeholder='Хорооны нэр'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='w-full dark:bg-slate-800 dark:text-white'>
            Мэдээлэл засах
          </Button>
        </form>
      </Form>
    </>
  );
};

export default KhorooEditPage;
