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
  supervisor: z.string().min(1, { message: 'Захиалагчын хяналтын байгууллага оруулна уу' }),
});

export default function SupervisorForm() {
  const { toast } = useToast();




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { supervisor: '' },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("data.branch", data.supervisor)
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/supervisor/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ s_name: data.supervisor }),
      });
      console.log("res", res)
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Амжилтгүй');
      }

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
          name='supervisor'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Захиалагчын хяналтын байгууллага </FormLabel>
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
