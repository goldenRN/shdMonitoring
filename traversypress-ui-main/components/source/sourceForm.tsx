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
import { Check, ChevronsUpDown, Maximize } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'cmdk';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';

const formSchema = z.object({
  source: z.string().min(1, { message: 'Хөрөнгө оруулалтын эх үүсвэр оруулна уу' }),
  status: z.string().min(1, { message: 'Эх үүсвэр' }),
});

export default function SalbarForm() {
  const { toast } = useToast();
const status = [
    { sc_id: 1, sc_name: 'Улсын' },
    { sc_id: 2, sc_name: 'Нийслэлийн' },
    { sc_id: 3, sc_name: 'Дүүргийн' },
  ];

  const [sourceOpen, setSourceOpen] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { source: '', status: 'Улсын' },
    
  });
//s_id s_name s_status 0 uls 1 niislel 2 duureg
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const sc_id = status.find((s) => s.sc_name === data.status)?.sc_id;

    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/source/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ sc_name: data.source, sc_status: sc_id }),
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
         <div className="min-w-[300px] flex-1">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'> Эх үүсвэр төрөл</FormLabel>
                          <Popover open={sourceOpen} onOpenChange={setSourceOpen}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" role="combobox" className="w-[360px] justify-between">
                                <span className="truncate">
                                  {field.value
                                    ? field.value
                                    : 'Эх үүсвэр сонгох'}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-slate-100 dark:bg-slate-500 w-[360px] p-0">
                              <Command>
                                <CommandInput placeholder="Хайх..." className="h-9 w-[360px] p-0" />
                                <CommandList>
                                  <CommandEmpty>эх үүсвэр олдсонгүй.</CommandEmpty>
                                  <CommandGroup>
                                    {Array.isArray(status) && status.length > 0 ? (
                                      status.map((sc) => (
                                        <PopoverPrimitive.Close asChild key={sc.sc_id}>
                                          <CommandItem
                                            value={sc.sc_name}
                                            onSelect={() => {
                                              form.setValue('status', sc.sc_name); // ID хадгална
                                              setSourceOpen(false);
                                            }}
                                            className={cn(
                                              'flex flex-row items-center gap-3 px-3 py-2',
                                              'border-b border-zinc-200 bg-gray-100 hover:bg-gray-200',
        
                                            )}
                                          >
                                            {sc.sc_name}
                                          </CommandItem>
                                        </PopoverPrimitive.Close>
                                      ))) : (
                                      <div className="text-gray-500 text-xs">Өгөгдөл байхгүй</div>
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
        <Button className='w-full'>Хадгалах</Button>
      </form>
    </Form>
  );
}
