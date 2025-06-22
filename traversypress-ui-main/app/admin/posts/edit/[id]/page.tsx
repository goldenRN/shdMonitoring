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
  engineer: z.string().min(1, { message: 'Хариуцсан инженер' }),
  title: z.string().min(1, { message: 'Гарчиг' }),
  body: z.string().min(1, { message: 'Агуулга' }),

  khoroo: z.array(z.string()).min(1, { message: 'Хороо сонгоно уу' }),
  startDate: z.string().min(1, { message: 'Огноо' }),
  endDate: z.string().min(1, { message: 'Огноо' }),
  stage: z.string().min(1, { message: 'Гүйцэтгэлийн үе шат' }),
  precent: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().min(1, { message: 'Гэрээний дүн 1-с бага байж болохгүй' })
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
interface Posts {
  newsid: number
  title: string
  ordernum: string
  contractor: string
  contractcost: number
  engener: string
  startdate: Date
  enddate: Date
  impphase: string
  imppercent: number
  source: string
  totalcost: number
  news: string
  createdat: Date
  updatedat: Date
  khoroo: { name: string }[]
}

const PostEditPage = ({ params }: PostEditPageProps) => {
  const { toast } = useToast();
  const [postsData, setPostsData] = useState<Posts[]>([])
  const [khoroos, setKhoroos] = useState<Khoroo[]>([]);
  const id = params.id;

  const [open, setOpen] = useState(false);
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
      engineer: '',
      title: '',
      body: '',
      khoroo: [],
      startDate: '',
      endDate: '',
      stage: '',
      precent: 0,
    },
  });
  const selectedKhoroos = form.watch("khoroo");
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [khRes, postRes] = await Promise.all([
          fetch('https://shdmonitoring.ub.gov.mn/api/khoroo'),
          fetch(`https://shdmonitoring.ub.gov.mn/api/posts/detail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          })
        ]);

        const khData = await khRes.json();
        const postJson = await postRes.json();
        const post = postJson.data;

        // Set khoroos BEFORE reset
        setKhoroos(khData);

        form.reset({
          order: post.ordernum || '',
          source: post.source || '',
          executor: post.contractor || '',
          budget: post.contractcost || 0,
          contractValue: post.totalcost || 0,
          engineer: post.engener || '',
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
      engener: data.engineer,
      startDate: formattedsdate,
      endDate: formattededate,
      impPhase: data.stage,
      impPercent: data.precent,
      source: data.source,
      totalCost: data.budget,
      news: data.body,
      khoroo: khorooId,
      newsId: Number(id)
    }
    // console.log('body Амжилттай үүсгэгдлээ:', body);
    try {
      const res = await fetch('https://shdmonitoring.ub.gov.mn/api/posts/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          orderNum: data.order,
          contractor: data.executor,
          contractCost: data.contractValue,
          engener: data.engineer,
          startDate: formattedsdate,
          endDate: formattededate,
          impPhase: data.stage,
          impPercent: data.precent,
          source: data.source,
          totalCost: data.budget,
          news: data.body,
          khoroo: khorooId,
          newsId: Number(id)
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
              {['order', 'source', 'executor'].map((name, i) => (
                <div className="basis-1/3" key={i}>
                  <FormField
                    control={form.control}
                    name={name as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                          {{
                            order: 'Захирамжийн дугаар',
                            source: 'Эх үүсвэр',
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

            {/* Төсөв, Гэрээний дүн, Инженер */}
            <div className="flex flex-row gap-10">
              {['budget', 'contractValue', 'engineer'].map((name, i) => (
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
                            engineer: 'Хариуцсан инженер',
                          }[name]}
                        </FormLabel>
                        <FormControl>
                          <Input className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' {...field}
                            type={name === 'engineer' ? 'text' : 'number'}
                            step={name === 'engineer' ? undefined : 1} />
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

            <div className="flex flex-row gap-10">
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
            </div>

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
