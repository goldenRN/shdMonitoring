'use client';

import BackButton from '@/components/BackButton';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

const formSchema = z.object({
    dist: z.string().min(1, {
        message: 'Дүүрэг сонгон уу',
    }),
    khoroo: z.string().min(1, {
        message: 'Хороо оруулна уу',
    }),
});

interface KhorooNewPageProps {
    params: {
        id: string;
    };
}

const KhorooNewPage = ({ params }: KhorooNewPageProps) => {
    const { toast } = useToast();
    const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
    const fetchDistricts = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/khoroo/districts');
            const data = await res.json();
            console.log("data==", data)
            setDistricts(data);
        } catch (err) {
            console.error('District fetch алдаа:', err);
        }
    };

    fetchDistricts();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dist: '',
            khoroo: '',
        },
    });

    const handleSubmit = async (data: { khoroo: string }) => {
        try {
            const res = await fetch('http://localhost:4000/api/khoroo/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ khoroo: data.khoroo }),
            });

            if (!res.ok) {
                throw new Error('Амжилтгүй');
            }

            const result = await res.json();
            console.log('Амжилттай үүсгэгдлээ:', result);
            toast({ title: 'Амжилттай хадгаллаа' });
            form.reset();
        } catch (err) {
            console.error('Хүсэлт алдаа:', err);
            toast({ title: 'Хадгалахад алдаа гарлаа', variant: 'destructive' });
        }
    };
    //   const handleSubmit = (data: z.infer<typeof formSchema>) => {
    //     toast({
    //       title: ' амжилттай хадгаллаа',
    //     });
    //   };

    return (
        <>
            <BackButton text=' Буцах' link='/khoroo' />
            <h3 className='text-2xl mb-4'>Хороо нэмэх</h3>
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
                                        className="w-full h-10 rounded-md bg-slate-100 dark:bg-slate-500 border-0 focus:ring-0 text-black dark:text-white px-3"
                                    >
                                        <option value=''>Сонгох</option>
                                        {districts.map((dist) => (
                                            <option key={dist.id} value={dist.id}>
                                                {dist.name}
                                            </option>
                                        ))}
                                    </select>
                                    {/* <select 
                                        {...field}
                                        className='h-100 w-full bg-slate-100 dark:bg-slate-500 border-0 focus:ring-0 text-black dark:text-white'
                                      >
                                        <option className='h-100'
                                        value=''>Сонгох</option>
                                        {districts.map((dist) => (
                                          <option key={dist.id} value={dist.id}>
                                            {dist.name}
                                          </option>
                                        ))}
                                      </select> */}
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
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Хороо
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder=''
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className='w-full dark:bg-slate-800 dark:text-white'>
                        Хадгалах
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default KhorooNewPage;
