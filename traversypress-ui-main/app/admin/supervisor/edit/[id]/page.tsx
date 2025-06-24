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
   supervisor: z.string().min(1, {
    message: 'Захиалагчын хяналтын байгууллага оруулна уу',
  }),
  // sourceStatus: z.integer
});



const SupervisorEditPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const name = searchParams.get('s_name');
  const id = params.id


 
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {     
      supervisor: name || '',
    },
  });
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
   
   //console.log("dataбббббб==", districtsId);
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/supervisor/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          s_id: id,         
          s_name: data.supervisor,
        }),
      });

      if (res.ok) {
        toast({ title: 'Мэдээлэл амжилттай шинэчлэгдлээ' });
        // form.reset();
      } else {
        toast({ title: `Энэ нэрээр Захиалагчын хяналтын байгууллага бүртгэгдсэн байна`, variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Холболтын алдаа', variant: 'destructive' });
    }
  };

  return (
    <>
      <BackButton text='Буцах' link='/admin/supervisor' />
      <h3 className='text-2xl mb-4'>Мэдээлэл шинэчлэх</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>        

          {/* source input */}
          <FormField
            control={form.control}
            name='supervisor'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                  Захиалагчын хяналтын байгууллага
                </FormLabel>
                <FormControl>
                  <Textarea
                    className='bg-slate-100 dark:bg-slate-500 border-0 focus:ring-0 text-black dark:text-white'
                    placeholder='Захиалагчын хяналтын байгууллага'
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

export default SupervisorEditPage;
