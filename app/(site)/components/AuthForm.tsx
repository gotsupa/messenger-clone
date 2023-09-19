'use client'

import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { SignInResponse, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

import Input from '@/app/components/Input/Input'
import Button from '@/app/components/Button'
import AuthSocialButton from './AuthSocialButton'

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [session?.status, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    if (variant === 'REGISTER') {
      try {
        await axios.post('/api/register', data)

        debugger

        await signIn('credentials', data)
      } catch {
        toast.error('Something went wrong')
      }

      setIsLoading(false)

      return
    }

    const { error, ok } = (await signIn('credentials', {
      ...data,
      redirect: false,
    })) as SignInResponse

    setIsLoading(false)

    if (error) {
      toast.error('Invalid Credentials')

      return
    }

    if (ok) {
      toast.success('Logged in!')
      router.push('/users')
    }
  }

  const socialAction = async (action: string) => {
    setIsLoading(true)

    const { error, ok } = (await signIn(action, {
      redirect: false,
    })) as SignInResponse

    setIsLoading(false)

    if (error) {
      toast.error('Invalid Credentials')

      return
    }

    if (ok) {
      toast.success('Logged in!')
    }
  }

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')

      return
    }

    setVariant('LOGIN')
  }, [variant])

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            disabled={isLoading}
            errors={errors}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            disabled={isLoading}
            errors={errors}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 px-2 text-sm text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="cursor-pointer underline">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
