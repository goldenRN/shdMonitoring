'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  dist: z.string().min(1, { message: 'Дүүрэг сонгон уу' }),
  khoroo: z.string().min(1, { message: 'Хороо оруулна уу' }),
});

export default function KhorooForm() {
  const { toast } = useToast();
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/khoroo/districts');
        const data = await res.json();
        setDistricts(data);
      } catch (err) {
        console.error('District fetch алдаа:', err);
      }
    };
    fetchDistricts();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { dist: '', khoroo: '' },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/khoroo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ khoroo: data.khoroo }),
      });

      if (!res.ok) throw new Error('Амжилтгүй');

      const result = await res.json();
      toast({ title: 'Амжилттай хадгаллаа' });
      form.reset();
    } catch (err) {
      console.error('Хүсэлт алдаа:', err);
      toast({ title: 'Хадгалахад алдаа гарлаа', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='dist'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дүүрэг</FormLabel>
              <FormControl>
                <select {...field} className='w-full h-10 rounded-md bg-slate-100 text-black px-3'>
                  <option value=''>Сонгох</option>
                  {districts.map((dist) => (
                    <option key={dist.id} value={dist.id}>{dist.name}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='khoroo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Хороо</FormLabel>
              <FormControl>
                <Textarea className='bg-slate-100 text-black' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full'>Хадгалах</Button>
      </form>
    </Form>
  );
}
