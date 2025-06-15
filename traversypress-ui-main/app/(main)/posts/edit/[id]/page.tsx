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
import { Popover, PopoverTrigger, PopoverContent  } from '@radix-ui/react-popover';


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
  // khoroo: z.preprocess(
  //   (val) => val === '' ? undefined : Number(val),
  //   z.number().min(1, { message: 'Гэрээний дүн 1-с бага байж болохгүй' })
  // ),
  khoroo: z.string().min(1, { message: 'Хороо сонгоно уу' }),
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
  news: String
  createdat: Date
  updatedat: Date
  khoroo: string
}

const PostEditPage = ({ params }: PostEditPageProps) => {
  const { toast } = useToast();
const [postsData, setPostsData] = useState<Posts[]>([])
  // const post = posts.find((post) => post.id === params.id);

  const [open, setOpen] = useState(false);
  const PopoverClose = PopoverPrimitive.Close;
  // const post = posts.find((post) => post.id === params.id);
  const [khoroos, setKhoroos] = useState<Khoroo[]>([]);

  useEffect(() => {
    const fetchKhoroos = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/khoroo');
        const data = await res.json();
        setKhoroos(data);
      } catch (err) {
        console.error('Алдаа:', err);
      }
    };

    fetchKhoroos();
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts`)
        const json = await res.json()
        console.log("json", json)
        setPostsData(json.data)
      } catch (err) {
        console.error('Алдаа:', err)
      }
    }
    fetchPosts()
  });
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: 'Мэдээлэл амжилттай шинэчлэгдлээ',
      // description: `Сүүлд засагдсан огноо ${data?.date}`,
    });
  };
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        order: '',
        source: '',
        executor: '',
        budget: undefined,
        contractValue: undefined,
        engineer: '',
        title: '',
        body: '',
        khoroo: '',
        startDate: '',
        endDate: '',
        stage: '',
        precent: undefined,
      },
    });

  return (
    <>
      <BackButton text=' Буцах' link='/posts' />
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
                        <Input className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' {...field} />
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
                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Хороо сонгох</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                      {field.value
                        ? khoroos.find((k) => k.id)?.name
                        : "Хороо сонгох"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-slate-100 dark:bg-slate-500 w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Хайх..." className="h-9 w-[200px] p-0" />
                      <CommandList>
                        <CommandEmpty>Хороо олдсонгүй.</CommandEmpty>
                        <CommandGroup>
                          {khoroos.map((khoroo) => (
                            <PopoverPrimitive.Close asChild key={khoroo.id}>
                              <CommandItem
                                value={khoroo.name}
                                onSelect={() => {
                                  form.setValue('khoroo', khoroo.name); // ID хадгална
                                  setOpen(false);
                                }}
                              >
                                {khoroo.name}
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
                        <Input className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white' {...field} />
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
  );
};

export default PostEditPage;
