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
   class: z.string().min(1, {
    message: 'Бүлэг оруулна уу',
  }),
});

interface ClassEditPageProps {
  params: {
    id: string;
  };
}

const ClassEditPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const name = searchParams.get('c_name');
  const id = params.id


 
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {     
      class: name || '',
    },
  });
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
   
   //console.log("dataбббббб==", districtsId);
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/branch/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          b_id: id,         
          b_name: data.class,
        }),
      });

      if (res.ok) {
        toast({ title: 'Мэдээлэл амжилттай шинэчлэгдлээ' });
        // form.reset();
      } else {
        toast({ title: `Энэ нэрээр бүлэг бүртгэгдсэн байна`, variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Холболтын алдаа', variant: 'destructive' });
    }
  };

  return (
    <>
      <BackButton text='Буцах' link='/admin/Class' />
      <h3 className='text-2xl mb-4'>Мэдээлэл шинэчлэх</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>        

          {/* Class input */}
          <FormField
            control={form.control}
            name='class'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                  Бүлэг
                </FormLabel>
                <FormControl>
                  <Textarea
                    className='bg-slate-100 dark:bg-slate-500 border-0 focus:ring-0 text-black dark:text-white'
                    placeholder='Бүлгийн нэр'
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

export default ClassEditPage;
