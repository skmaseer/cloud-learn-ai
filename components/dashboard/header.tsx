'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Cloud, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from './theme-toggle'
import { getUser, logoutUser, type CloudLearnUser } from '@/lib/auth'

export function Header() {
  const [user, setUser] = useState<CloudLearnUser | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  const displayName = user?.name || 'Student'
  const registerNumber = user?.registerNumber || ''
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label="CloudLearn AI home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-slate-800 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 dark:to-indigo-900">
            <Cloud className="size-5" aria-hidden="true" />
          </span>

          <span className="bg-gradient-to-r from-indigo-600 to-slate-700 bg-clip-text text-lg font-semibold tracking-tight text-transparent dark:from-indigo-300 dark:to-slate-200">
            CloudLearn AI
          </span>
        </a>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-2.5 pl-1 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label={`Open user menu for ${displayName}`}
            >
              <Avatar className="size-7">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-semibold text-white">
                  {initial}
                </AvatarFallback>
              </Avatar>

              <span className="hidden sm:inline">
                {displayName}
              </span>

              <ChevronDown
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
                  <span className="text-sm font-medium text-foreground">
                    {displayName}
                  </span>

                  <span className="text-xs font-normal text-muted-foreground">
                    Student
                  </span>

                  {registerNumber && (
                    <span className="text-xs font-normal text-muted-foreground">
                      Register No: {registerNumber}
                    </span>
                  )}
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
  onClick={() => {
    window.location.href = '/profile'
  }}
>
  <User aria-hidden="true" />
  Profile
</DropdownMenuItem>

              <DropdownMenuItem>
                <Settings aria-hidden="true" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
  variant="destructive"
  onClick={() => {
    localStorage.removeItem('cloudlearn_session')
    window.location.href = '/login'
  }}
>
  <LogOut aria-hidden="true" />
  Sign out
</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}