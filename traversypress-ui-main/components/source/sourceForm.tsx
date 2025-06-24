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
  source: z.string().min(1, { message: 'Хөрөнгө оруулалтын эх үүсвэр оруулна уу' }),
});

export default function SalbarForm() {
  const { toast } = useToast();




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { source: '' },
  });
//s_id s_name s_status 0 uls 1 niislel 2 duureg
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("data.source", data.source)
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/source/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ sc_name: data.source, sc_status: 1 }),
      });
      console.log("res", res)
      if (!res.ok) throw new Error('Амжилтгүй');

      const result = await res.json();
      console.log("res", result)
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
          name='source'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Хөрөнгө оруулалтын эх үүсвэр</FormLabel>
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
