import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { s3, S3_BUCKET } from '@/lib/s3'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const key = `materials/${Date.now()}-${file.name}`

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      }),
    )

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: file.name,
        key,
        size: file.size,
        type: file.type,
      },
    })
    } catch (error) {
    console.error('S3 upload error:', error)

    const message =
      error instanceof Error ? error.message : 'Unknown S3 error'

    return NextResponse.json(
      { error: message },
      { status: 500 },
    )
  }
}