'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from '@/components/ui/switch'

const schema = yup.object({
  userName: yup.string().required('Username is required'),
  Email: yup.string().email('Invalid email').required('Email is required'),
  Name: yup.string().nullable(),
  password: yup.string().min(8, 'Password must be at least 8 characters'),
  cName: yup.string().nullable(),
  tags: yup.array().of(yup.string()),
}).required()

type FormData = yup.InferType<typeof schema>

const initialData: FormData = {
  userName: 'johndoe123',
  Email: 'john.doe@example.com',
  Name: 'John Doe',
  password: '',
  cName: '',
}

export function EditProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData
  })

  const onSubmit = (data: FormData) => {
    console.log('Saving user details:', data)
    console.log('Avatar:', avatar)
    setIsEditing(false)
    // Here you would typically send the updated details to your backend
  }

  const handleReset = () => {
    reset(initialData)
    setAvatar(null)
    setIsEditing(false)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>View and edit your profile details</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="flex justify-end gap-2 mb-4">
          <div className='flex items-center gap-4'>
          <Label htmlFor="edit-mode">Enable Editing</Label>
          <Switch
            id="edit-mode"
            checked={isEditing}
            onCheckedChange={setIsEditing}
          />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatar || '/placeholder.svg'} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {isEditing && (
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                  <Upload className="w-4 h-4" />
                  <span>Upload Avatar</span>
                </div>
                <Input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                  accept="image/*"
                  disabled={!isEditing}
                />
              </Label>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => <Input {...field} disabled={!isEditing} />}
            />
            {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Email">Email</Label>
            <Controller
              name="Email"
              control={control}
              render={({ field }) => <Input {...field} type="email" disabled={!isEditing} />}
            />
            {errors.Email && <p className="text-red-500 text-sm">{errors.Email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Name">Name</Label>
            <Controller
              name="Name"
              control={control}
              render={({ field }) => <Input {...field} disabled={!isEditing} />}
            />
            {errors.Name && <p className="text-red-500 text-sm">{errors.Name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input {...field} type="password" disabled={!isEditing} />}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cName">College Name</Label>
            <Controller
              name="cName"
              control={control}
              render={({ field }) => <Input {...field} disabled={!isEditing} />}
            />
            {errors.cName && <p className="text-red-500 text-sm">{errors.cName.message}</p>}
          </div>


          {isEditing && (
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

