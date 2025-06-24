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
  branch: z.string().min(1, { message: 'Салбараа оруулна уу' }),
});

export default function SalbarForm() {
  const { toast } = useToast();
 

  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { branch: '' },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("data.branch", data.branch)
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/branch/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ b_name: data.branch }),
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
          name='branch'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Салбар</FormLabel>
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
