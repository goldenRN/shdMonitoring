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
import { CommandSeparator } from 'cmdk';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'cmdk';
import { Check, ChevronsUpDown, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  order: z.string().min(1, { message: 'Захирамжийн дугаар' }),
  source: z.string().min(1, { message: 'Эх үүсвэр' }),
  executor: z.string().min(1, { message: 'Гүйцэтгэгч' }),
  budget: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().min(1, { message: ' 1-с бага байж болохгүй' })
  ),
  contractValue: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().min(1, { message: 'Гэрээний дүн 1-с бага байж болохгүй' })
  ),
  supervisor: z.string().min(1, { message: 'Захиалагчын хяналтын байгууллага' }),
  title: z.string().min(1, { message: 'Гарчиг' }),
  body: z.string().min(1, { message: 'Агуулга' }),
  // khoroo: z.preprocess(
  //   (val) => val === '' ? undefined : Number(val),
  //   z.number().min(1, { message: 'Гэрээний дүн 1-с бага байж болохгүй' })
  // ),
  //khoroo: z.string().min(1, { message: 'Хороо сонгоно уу' }),
  khoroo: z.array(z.string()).min(1, { message: 'Хороо сонгоно уу' }),
  startDate: z.string().min(1, { message: 'Огноо' }),
  endDate: z.string().min(1, { message: 'Огноо' }),
  stage: z.string().min(1, { message: 'Ажлын явц оруулна уу' }),
  // precent: z.preprocess(
  // (val) => val === '' ? undefined : Number(val),
  // z.number().min(1, { message: 'Гэрээний дүн 1-с бага байж болохгүй' })
  //)
  branch: z.string().min(1, { message: 'Салбар оруулна уу' }),
  precent: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number()
      .min(1, { message: '1-ээс бага байж болохгүй' })
      .max(100, { message: '100-аас их байж болохгүй' })
  )
});

interface PostNewPageProps {
  params: { id: string };
}
interface Khoroo {
  id: number;
  name: string;
  district: string;
}
interface Branch {
  b_id: number;
  b_name: string;
}
interface Source {
  sc_id: number;
  sc_name: string;
}
interface Supervisor {
  s_id: number;
  s_name: string;
}
interface WorkProgres {
  wp_id: number;
  wp_name: string;
}
const PostNewPage = ({ params }: PostNewPageProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [superOpen, setSuperOpen] = useState(false);
  const [wprogressOpen, setWprogressOpen] = useState(false);

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  // const post = posts.find((post) => post.id === params.id);
  const [khoroos, setKhoroos] = useState<Khoroo[]>([]);
  const [branch, setBranch] = useState<Branch[]>([]);
  const [source, setSource] = useState<Source[]>([]);
  const [supervisor, setSupervisor] = useState<Supervisor[]>([]);
  const [WorkProgres, setWorkProgres] = useState<WorkProgres[]>([]);

  useEffect(() => {
    const fetchKhoroos = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/khoroo');
        const data = await res.json();
        setKhoroos(data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    }
    fetchKhoroos()
    const fetchBranch = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/branch');
        const data = await res.json();
        setBranch(data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    }
    fetchBranch()
    const fetchSource = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/source');
        const data = await res.json();
        setSource(data);

      } catch (err) {
        console.error('Алдаа:', err);
      }
    }
    fetchSource()
    const fetchWorkprogres = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/workprogress');
        const data = await res.json();
        setWorkProgres(data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    }
    fetchWorkprogres()
    const fetchsetSupervisor = async () => {
      try {
        const res = await fetch('https://shdmonitoring.ub.gov.mn/api/supervisor');
        const data = await res.json();
        setSupervisor(data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    }
    fetchsetSupervisor().then(() => setLoading(false))
    console.log("branch==", branch)
    console.log("WorkProgres==", WorkProgres)
    console.log("source==", source)
    console.log("supervisor==", supervisor)
  }, [page])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order: '',
      source: '',
      executor: '',
      budget: Number(''),
      contractValue: Number(''),
      supervisor: '',
      title: '',
      body: '',
      khoroo: [],
      startDate: '',
      endDate: '',
      branch: '',
      stage: '',
      precent: Number(''),
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const supervisor_id = supervisor.find((s) => s.s_name === data.supervisor)?.s_id;
    const impPhase_id = WorkProgres.find((wp) => wp.wp_name === data.stage)?.wp_id;
    const source_id = source.find((sc) => sc.sc_name === data.source)?.sc_id;
    const branch_id = branch.find((b) => b.b_name === data.branch)?.b_id;
    const khorooId = khoroos
      .filter((kh) => data.khoroo.includes(kh.name))
      .map((kh) => kh.id);
    const sdate = new Date(data.startDate);
    const edate = new Date(data.endDate);
    const formattedsdate = sdate.toUTCString();
    const formattededate = edate.toUTCString();
    const body = {
      title: data.title,
      orderNum: data.order,
      contractor: data.executor,
      contractCost: data.contractValue,
      supervisor: data.supervisor,
      supervisor_id: supervisor_id,
      startDate: formattedsdate,
      endDate: formattededate,
      impPhase: data.stage,
      impPhase_id: impPhase_id,
      impPercent: data.precent,
      source: data.source,
      source_id: source_id,
      branch: data.branch,
      branch_id: branch_id,
      totalCost: data.budget,
      news: data.body,
      khoroo: khorooId,

    }
    console.log('body Амжилттай үүсгэгдлээ:', body);
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.log('res==:', res);

        alert({ title: 'Хадгалахад алдаа гарлаа', variant: 'destructive' });
        throw new Error('Амжилтгүй');
      }

      const result = await res.json();
      console.log('Мэдээлэл амжилттай хадгалагдлаа:', result);
      toast({
        title: '✅ Амжилттай',
        description: 'Мэдээлэл амжилттай хадгалагдлаа.',
        variant: 'default', // эсвэл 'success' хэрвээ custom variant байгаа бол
        duration: 3000,
      });
      form.reset();
    } catch (err) {
      console.error('Хүсэлт алдаа:', err);
      toast({ title: 'Хадгалахад алдаа гарлаа', variant: 'destructive' });
    }
    // Жишээ лог
    // console.log('Form data:', data);
  };

  return loading ? (
    <Skeleton className="h-32 w-full" />
  ) : (
    <>
      <BackButton text=' Буцах' link='/admin/posts' />
      <h3 className='text-2xl mb-4'>Мэдээлэл оруулах</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
          {/* Захирамжийн дугаар, Эх үүсвэр, Гүйцэтгэгч */}
          <div className="flex flex-row gap-20">
            {['order', 'executor'].map((name, i) => (
              <div className="basis-1/2" key={i}>
                <FormField
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                        {{
                          order: 'Захирамжийн дугаар',
                          executor: 'Гүйцэтгэгч',
                        }[name]}
                      </FormLabel>
                      <FormControl>
                        <Input className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          {/* eh uusver */}
          <div className='flex flex-wrap gap-10'>
            <div className="min-w-[300px] flex-1">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Хөрөнгө оруулалтын эх үүсвэр</FormLabel>
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
                              {Array.isArray(source) && source.length > 0 ? (
                                source.map((sc) => (
                                  <PopoverPrimitive.Close asChild key={sc.sc_id}>
                                    <CommandItem
                                      value={sc.sc_name}
                                      onSelect={() => {
                                        form.setValue('source', sc.sc_name); // ID хадгална
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
            <div className="min-w-[200px] flex-1">
              <FormField
                control={form.control}
                name="supervisor"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Захиалагчын хяналтын байгууллага</FormLabel>
                    <Popover open={superOpen} onOpenChange={setSuperOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-[360px] justify-between">
                          <span className="truncate">
                            {field.value
                              ? field.value
                              : 'Хяналтын байгууллага сонгох'}
                          </span>
                          {/*  сонгох */}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-slate-100 dark:bg-slate-500 w-[360px] p-0">
                        <Command>
                          <CommandInput placeholder="Хайх..." className="h-9 w-[360px] p-0" />
                          <CommandList>
                            <CommandEmpty>байгууллага олдсонгүй.</CommandEmpty>
                            <CommandGroup>
                              {supervisor.map((s) => (
                                <PopoverPrimitive.Close asChild key={s.s_id}>
                                  <CommandItem
                                    value={s.s_name}
                                    onSelect={() => {
                                      form.setValue('supervisor', s.s_name); // ID хадгална
                                      setSuperOpen(false);
                                    }}
                                    className={cn(
                                      'flex flex-row items-center gap-3 px-3 py-2',
                                      'border-b border-zinc-200 bg-gray-100 hover:bg-gray-200',

                                    )}
                                  >
                                    {s.s_name}
                                  </CommandItem>
                                </PopoverPrimitive.Close>
                              ))}
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
            {/* salbar */}
            <div className="min-w-[300px] flex-1">
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Салбар сонгох</FormLabel>
                    <Popover open={branchOpen} onOpenChange={setBranchOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-[360px] justify-between">
                          <span className="truncate">
                            {field.value
                              ? field.value
                              : 'Салбар сонгох'}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-slate-100 dark:bg-slate-500 w-[360px] p-0">
                        <Command>
                          <CommandInput placeholder="Хайх..." className="h-9 w-[360px] p-0" />
                          <CommandList>
                            <CommandEmpty>Салбар олдсонгүй.</CommandEmpty>
                            <CommandGroup>
                              {branch.map((b) => (
                                <PopoverPrimitive.Close asChild key={b.b_id}>
                                  <CommandItem
                                    value={b.b_name}
                                    onSelect={() => {
                                      form.setValue('branch', b.b_name); // ID хадгална
                                      setBranchOpen(false);
                                    }}
                                    className={cn(
                                      'flex flex-row items-center gap-3 px-3 py-2',
                                      'border-b border-zinc-200 bg-gray-100 hover:bg-gray-200',
                                    )}
                                  >
                                    {b.b_name}
                                  </CommandItem>
                                </PopoverPrimitive.Close>
                              ))}
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

          </div>
          {/* Төсөв, Гэрээний дүн, Инженер */}
          <div className="flex flex-row gap-10">
            {['budget', 'contractValue', 'precent'].map((name, i) => (
              <div className="basis-1/3" key={i}>
                <FormField
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                        {{
                          budget: 'Төсөвт өртөг',
                          contractValue: 'Гэрээний дүн',
                          precent: 'Гүйцэтгэлийн хувь',
                        }[name]}
                      </FormLabel>
                      <FormControl>
                        <Input className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' {...field}
                          type={'number'}
                          min={name === 'precent' ? 1 : undefined}
                          max={name === 'precent' ? 100 : undefined}
                          step={name === 'precent' ? 1 : undefined} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          {/* Гарчиг */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Гарчиг</FormLabel>
                <FormControl>
                  <Input className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Агуулга */}
          <FormField
            control={form.control}
            name='body'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Агуулга</FormLabel>
                <FormControl>
                  <Textarea className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Хороо сонгох */}
          <div className='flex flex-wrap gap-10'>
            <div className="min-w-[300px] flex-1">
              <FormField
                control={form.control}
                name="khoroo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                      Хороо сонгох
                    </FormLabel>
                    <Popover open={open} onOpenChange={setOpen} >
                      <PopoverTrigger asChild>

                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[400px] justify-between truncate"
                        >
                          <span className="truncate">
                            {field.value.length > 0
                              ? field.value.join(', ')
                              : 'Хороо сонгох'}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-slate-100 dark:bg-slate-500 w-[400px] max-h-[300px] overflow-auto p-0">
                        <Command>
                          <CommandInput placeholder="Хайх..." className="h-9 p-2" />
                          <CommandList>
                            <CommandEmpty>Хороо олдсонгүй.</CommandEmpty>
                            <CommandGroup className='border-b border-zinc-200'>
                              {khoroos.map((khoroo) => {
                                const selected = field.value.includes(khoroo.name);

                                return (
                                  <CommandItem
                                    key={khoroo.id}
                                    value={khoroo.name}
                                    onSelect={() => {
                                      const alreadySelected = field.value.includes(khoroo.name);
                                      if (alreadySelected) {
                                        form.setValue(
                                          'khoroo',
                                          field.value.filter((v) => v !== khoroo.name)
                                        );
                                      } else {
                                        form.setValue('khoroo', [...field.value, khoroo.name]);
                                      }
                                    }}
                                    className={cn(
                                      'flex flex-row items-center gap-3 px-3 py-2',
                                      'border-b border-zinc-200 bg-gray-100 hover:bg-gray-200',
                                      selected && 'font-semibold'
                                    )}
                                  >
                                    <Check
                                      className={cn(
                                        'h-4 w-4 text-green-600 transition-opacity',
                                        selected ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {khoroo.name}
                                  </CommandItem>
                                );
                              })}
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
            {/* salbar */}
            <div className="min-w-[300px] flex-1">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Ажлын явц </FormLabel>
                    <Popover open={wprogressOpen} onOpenChange={setWprogressOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-[360px] justify-between">
                          <span className="truncate">
                            {field.value
                              ? field.value
                              : 'Ажлын явц сонгох'}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-slate-100 dark:bg-slate-500 w-[360px] p-0">
                        <Command>
                          <CommandInput placeholder="Хайх..." className="h-9 w-[360px] p-0" />
                          <CommandList>
                            <CommandEmpty>Ажлын явц олдсонгүй.</CommandEmpty>
                            <CommandGroup>
                              {WorkProgres.map((wp) => (
                                <PopoverPrimitive.Close asChild key={wp.wp_id}>
                                  <CommandItem
                                    value={wp.wp_name}
                                    onSelect={() => {
                                      form.setValue('stage', wp.wp_name); // ID хадгална
                                      setWprogressOpen(false);
                                    }}
                                    className={cn(
                                      'flex flex-row items-center gap-3 px-3 py-2',
                                      'border-b border-zinc-200 bg-gray-100 hover:bg-gray-200',
                                    )}
                                  >
                                    {wp.wp_name}
                                  </CommandItem>
                                </PopoverPrimitive.Close>
                              ))}
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
          </div>
          {/* Огноо (гэрээний хугацаа) */}
          <div className="flex flex-row gap-10">
            {['startDate', 'endDate'].map((name, i) => (
              <div className="basis-1/2" key={i}>
                <FormField
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                        {{
                          startDate: 'Эхлэх хугацаа',
                          endDate: 'Дуусах хугацаа',
                        }[name]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-slate-100 dark:bg-slate-500 text-black dark:text-white"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full mb-100 dark:bg-slate-800 dark:text-white">
            Хадгалах
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PostNewPage;
