'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Cloud,
  Download,
  FileText,
  FileType,
  FolderOpen,
  Search,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const initialMaterials = [
  {
    id: 1,
    title: 'Database Management Systems',
    subject: 'DBMS',
    type: 'PDF',
    size: '2.4 MB',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Operating Systems Notes',
    subject: 'Operating Systems',
    type: 'PDF',
    size: '3.1 MB',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Data Structures & Algorithms',
    subject: 'Data Structures',
    type: 'DOCX',
    size: '1.8 MB',
    icon: FileType,
  },
  {
    id: 4,
    title: 'Computer Organization',
    subject: 'Computer Organization',
    type: 'PDF',
    size: '2.7 MB',
    icon: FileText,
  },
  {
    id: 5,
    title: 'Java Programming Notes',
    subject: 'Java',
    type: 'PDF',
    size: '4.2 MB',
    icon: FileText,
  },
  {
    id: 6,
    title: 'Machine Learning Fundamentals',
    subject: 'Machine Learning',
    type: 'PDF',
    size: '3.6 MB',
    icon: FileText,
  },
]

export default function MaterialsPage() {
  const [search, setSearch] = useState('')
  const [materials, setMaterials] = useState(initialMaterials)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load materials from AWS S3
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await fetch('/api/materials/list')

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error || 'Failed to load materials',
          )
        }

        const uploadedMaterials =
          data.files?.map(
            (file: {
              key: string
              size?: number
              lastModified?: string
            }) => {
              const fileName =
                file.key.split('/').pop() || 'Unnamed File'

              const cleanName = fileName.replace(/^\d+-/, '')

              const extension =
                cleanName.split('.').pop()?.toUpperCase() ||
                'FILE'

              const sizeInMB = file.size
                ? (file.size / (1024 * 1024)).toFixed(2)
                : '0.00'

              return {
                id: file.key,
                title: cleanName.replace(/\.[^/.]+$/, ''),
                subject: 'Uploaded Material',
                type: extension,
                size: `${sizeInMB} MB`,
                icon: FileText,
              }
            },
          ) ?? []

        setMaterials((currentMaterials) => {
          const existingMaterials = currentMaterials.filter(
            (material) =>
              !uploadedMaterials.some(
                (uploaded: { title: string }) =>
                  uploaded.title === material.title,
              ),
          )

          return [
            ...uploadedMaterials,
            ...existingMaterials,
          ]
        })
      } catch (error) {
        console.error(
          'Failed to load S3 materials:',
          error,
        )
      }
    }

    loadMaterials()
  }, [])

  // Upload material to AWS S3
  const handleAddMaterial = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        '/api/materials/upload',
        {
          method: 'POST',
          body: formData,
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Upload failed',
        )
      }

      const sizeInMB = (
        file.size /
        (1024 * 1024)
      ).toFixed(2)

      const extension =
        file.name.split('.').pop()?.toUpperCase() ||
        'FILE'

      const newMaterial = {
        id: data.file.key,
        title: file.name.replace(
          /\.[^/.]+$/,
          '',
        ),
        subject: 'Uploaded Material',
        type: extension,
        size: `${sizeInMB} MB`,
        icon: FileText,
      }

      setMaterials((currentMaterials) => [
        newMaterial,
        ...currentMaterials,
      ])

      alert(
        `"${file.name}" uploaded to AWS S3 successfully!`,
      )
    } catch (error) {
      console.error('Upload error:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to upload file.',
      )
    } finally {
      event.target.value = ''
    }
  }

  const filteredMaterials = materials.filter(
    (material) =>
      material.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      material.subject
        .toLowerCase()
        .includes(search.toLowerCase()),
  )

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/40"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-slate-800 text-white shadow-md shadow-indigo-500/20 dark:to-indigo-900">
              <Cloud className="size-4" />
            </span>

            <span className="hidden text-sm font-semibold sm:inline">
              CloudLearn AI
            </span>
          </div>
        </div>

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Learning Resources
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Study Materials
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Access your study notes, course materials,
            and learning resources in one place.
          </p>
        </div>

        {/* Search and upload */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search materials..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <FolderOpen className="size-4" />
            Add Material
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            onChange={handleAddMaterial}
          />
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                <BookOpen className="size-5" />
              </div>

              <div>
                <p className="text-2xl font-semibold">
                  {materials.length}
                </p>

                <p className="text-xs text-muted-foreground">
                  Total Materials
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                <FileText className="size-5" />
              </div>

              <div>
                <p className="text-2xl font-semibold">
                  {
                    materials.filter(
                      (material) =>
                        material.type === 'PDF',
                    ).length
                  }
                </p>

                <p className="text-xs text-muted-foreground">
                  PDF Resources
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                <BookOpen className="size-5" />
              </div>

              <div>
                <p className="text-2xl font-semibold">
                  {
                    new Set(
                      materials.map(
                        (material) =>
                          material.subject,
                      ),
                    ).size
                  }
                </p>

                <p className="text-xs text-muted-foreground">
                  Subjects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Materials list */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-xl backdrop-blur-xl">
          <div className="border-b border-border p-5 sm:p-6">
            <h2 className="font-semibold">
              Your Materials
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select a resource to view or download it.
            </p>
          </div>

          <div className="divide-y divide-border">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => {
                const Icon = material.icon

                return (
                  <div
                    key={material.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-medium">
                          {material.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            {material.subject}
                          </span>

                          <span>•</span>

                          <span>
                            {material.type}
                          </span>

                          <span>•</span>

                          <span>
                            {material.size}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-accent"
                      onClick={() => {
  if (typeof material.id === 'string') {
    window.location.href = `/api/materials/download?key=${encodeURIComponent(
      material.id,
    )}`
  } else {
    alert('This is a demo material. Only uploaded S3 materials can be downloaded.')
  }
}}
                    >
                      <Download className="size-4" />
                      Download
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="p-10 text-center">
                <p className="font-medium">
                  No materials found
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try searching for another subject or
                  material.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          CloudLearn AI · AI-Powered Cloud Learning Platform
        </p>
      </div>
    </main>
  )
}