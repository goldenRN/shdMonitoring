'use client';

import BackButton from '@/components/BackButton';
import * as z from 'zod';
import {  useForm  } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import shdLogo from '@/assets/logo.png'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Нэвтрэх нэр оруулна уу',
    }),
  password: z.string().min(1, {
    message: 'Нууц үг оруулна уу',
  }),
});

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // const handleSubmit = (data: z.infer<typeof formSchema>) => {
  //   router.push('/');
  // };
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.email, // Таны backend "username" гэдгээр хүлээж авдаг
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(error.message || 'Login failed');
      }
      else {
        const result = await response.json();
        const token = result.token;

        // Токеныг хадгалах (жишээ нь localStorage-д)
        // localStorage.setItem('token', token);

        // Амжилттай нэвтэрсэн бол dashboard хуудас руу чиглүүлэх
        router.push('/admin/dashboard');
      }


    } catch (error) {
      console.error('Login error:', error);
      alert('Системийн алдаа. Дахин оролдоно уу.');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">


        <div className="flex flex-col items-center space-y-2">
          <Image
            priority={true}
            src={shdLogo}
            width={100}
            height={100}
            alt=""
          />
          <div className="text-center">
            <CardTitle className="text-xl">
              {/* СХДЗДТГ */}
              СОНГИНО ХАЙРХАН ДҮҮРГИЙН
            </CardTitle>
            <CardTitle className="text-xl">
              ЗАСАГ ДАРГЫН ТАМГЫН ГАЗАР
            </CardTitle>
            <CardDescription>
              Хяналт-шинжилгээ, үнэлгээний хэлтэс
            </CardDescription>
          </div>
        </div>


      </CardHeader>
      <CardContent className='space-y-2'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Удирдлагын хэсэгт нэвтрэх
              </span>
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=' text-xs font-bold text-zinc-500 dark:text-white'>
                    Нэвтрэх нэр
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible: ring-offset-0'
                      placeholder='Нэвтрэх нэр'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=' text-xs font-bold text-zinc-500 dark:text-white'>
                    Нууц үг
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible: ring-offset-0'
                      placeholder='Нууц үг'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-full'>Үргэлжлүүлэх</Button>
            {/* <div className="text-center text-sm">
              Вэб сайтруу ?{" "}
              <a href="#" className="underline underline-offset-4">
                shdmonitoring.ub.gov.mn
              </a>

            </div> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
