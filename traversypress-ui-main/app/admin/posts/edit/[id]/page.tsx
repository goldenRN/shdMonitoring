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
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'cmdk';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as  PopoverPrimitive from '@radix-ui/react-popover';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';


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
  supervisor: z.string().min(1, { message: 'Хариуцсан инженер' }),
  title: z.string().min(1, { message: 'Гарчиг' }),
  body: z.string().min(1, { message: 'Агуулга' }),

  khoroo: z.array(z.string()).min(1, { message: 'Хороо сонгоно уу' }),
  startDate: z.string().min(1, { message: 'Огноо' }),
  endDate: z.string().min(1, { message: 'Огноо' }),
  stage: z.string().min(1, { message: 'Гүйцэтгэлийн үе шат' }),
  branch: z.string().min(1, { message: 'Салбар оруулна уу' }),
  precent: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number()
      .min(1, { message: '1-ээс бага байж болохгүй' })
      .max(100, { message: '100-аас их байж болохгүй' })
  )
});

interface PostEditPageProps {
  params: {
    id: string;
  };
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
interface Posts {
  newsid: number
  title: string
  ordernum: string
  contractor: string
  contractcost: number
  supervisor: string
  startdate: Date
  enddate: Date
  impphase: string
  imppercent: number
  source: string
  totalcost: number
  news: string
  branch: string
  createdat: Date
  updatedat: Date
  khoroo: { name: string }[]
}

const PostEditPage = ({ params }: PostEditPageProps) => {
  const { toast } = useToast();
  const [postsData, setPostsData] = useState<Posts[]>([])
  const [khoroos, setKhoroos] = useState<Khoroo[]>([]);
  const [branch, setBranch] = useState<Branch[]>([]);
  const [source, setSource] = useState<Source[]>([]);
  const [supervisor, setSupervisor] = useState<Supervisor[]>([]);
  const [WorkProgres, setWorkProgres] = useState<WorkProgres[]>([]);
  const id = params.id;

  const [open, setOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [superOpen, setSuperOpen] = useState(false);
  const [wprogressOpen, setWprogressOpen] = useState(false);
  const PopoverClose = PopoverPrimitive.Close;
  // const post = posts.find((post) => post.id === params.id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order: '',
      source: '',
      executor: '',
      budget: 0,
      contractValue: 0,
      supervisor: '',
      title: '',
      body: '',
      khoroo: [],
      startDate: '',
      endDate: '',
      branch: '',
      stage: '',
      precent: 0,
    },
  });
  const selectedKhoroos = form.watch("khoroo");
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [khRes, postRes, branchRes, sourceRes, wpRes, superRes] = await Promise.all([
          fetch('https://shdmonitoring.ub.gov.mn/api/khoroo'),
          fetch(`https://shdmonitoring.ub.gov.mn/api/posts/detail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          }),
          fetch('https://shdmonitoring.ub.gov.mn/api/branch'),
          fetch('https://shdmonitoring.ub.gov.mn/api/source'),
          fetch('https://shdmonitoring.ub.gov.mn/api/workprogress'),
          fetch('https://shdmonitoring.ub.gov.mn/api/supervisor')
        ]);

        const khData = await khRes.json();
        const postJson = await postRes.json();
        const post = postJson.data;
        const branch = await branchRes.json();
        const source = await sourceRes.json();
        const wp = await wpRes.json();
        const superv = await superRes.json();

        // Set khoroos BEFORE reset
        setKhoroos(khData);
        setBranch(branch);
        setSource(source);
        setWorkProgres(wp);
        setSupervisor(superv);


        form.reset({
          order: post.ordernum || '',
          source: post.source || '',
          executor: post.contractor || '',
          budget: post.contractcost || 0,
          contractValue: post.totalcost || 0,
          supervisor: post.engener || '',
          title: post.title || '',
          body: post.news || '',
          khoroo: Array.isArray(post.khoroos)
            ? post.khoroos.map((k: { name: string }) => k.name)
            : [],
          startDate: post.startdate
            ? new Date(post.startdate).toISOString().slice(0, 10)
            : '',
          endDate: post.enddate
            ? new Date(post.enddate).toISOString().slice(0, 10)
            : '',
          stage: post.impphase || '',
          precent: post.imppercent || 0,
          branch: post.branch || ""
        });

        setPostsData(post);
        console.log("selectedKhoroos", selectedKhoroos)
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchAll();
  }, [form, id]);


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
      newsId: Number(id)
    }
    console.log('body Амжилттай үүсгэгдлээ:', body);
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body
        }),
      });

      if (res.ok) {
        toast({ title: 'Мэдээлэл амжилттай шинэчлэгдлээ' });
        // form.reset();
      } else {
        toast({ title: 'Алдаа гарлаа', variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Холболтын алдаа', variant: 'destructive' });
    }
    toast({
      title: 'Мэдээлэл амжилттай шинэчлэгдлээ',
      // description: `Сүүлд засагдсан огноо ${data?.date}`,
    });
  };

  if (postsData.length === 0) {
    return <div>Уншиж байна...</div>; // эсвэл Loading spinner
  }
  else {


    return (
      <>
        <BackButton text=' Буцах' link='/admin/posts' />
        <h3 className='text-2xl mb-4'>Мэдээлэл оруулах</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
            {/* Захирамжийн дугаар, Эх үүсвэр, Гүйцэтгэгч */}
            <div className="flex flex-row gap-10">
              {['order', 'executor'].map((name, i) => (
                <div className="basis-1/3" key={i}>
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
                          {/* <Button
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
                      </Button> */}
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-[400px] justify-between truncate"
                          >
                            <span className="truncate">
                              {selectedKhoroos.length > 0
                                ? selectedKhoroos.join(', ')
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
                              <CommandGroup>
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

            {/* <div className="flex flex-row gap-10">
              {['stage', 'precent'].map((name, i) => (
                <div className="basis-1/2" key={i}>
                  <FormField
                    control={form.control}
                    name={name as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                          {{
                            stage: 'Гүйцэтгэлийн үе шат',
                            precent: 'Гүйцэтгэлийн хувь',
                          }[name]}
                        </FormLabel>
                        <FormControl>
                          <Input className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' {...field}
                            type={name === 'precent' ? 'number' : 'text'}
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
            </div> */}

            {/* Submit button */}
            <Button type="submit" className="w-full dark:bg-slate-800 dark:text-white">
              Хадгалах
            </Button>
          </form>
        </Form>
      </>
    )
  };
};

export default PostEditPage;
