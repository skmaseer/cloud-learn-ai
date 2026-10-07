import { GetObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { s3, S3_BUCKET } from '@/lib/s3'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 },
      )
    }

    const result = await s3.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      }),
    )

    if (!result.Body) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 },
      )
    }

    const fileBytes = await result.Body.transformToByteArray()

    return new NextResponse(Buffer.from(fileBytes), {
      status: 200,
      headers: {
        'Content-Type':
          result.ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${key.split('/').pop()}"`,
      },
    })
  } catch (error) {
    console.error('S3 download error:', error)

    const message =
      error instanceof Error
        ? error.message
        : 'Failed to download file'

    return NextResponse.json(
      { error: message },
      { status: 500 },
    )
  }
}