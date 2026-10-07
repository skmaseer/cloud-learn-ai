import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { s3, S3_BUCKET } from '@/lib/s3'

export async function GET() {
  try {
    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: 'materials/',
      }),
    )

    const files =
      result.Contents?.map((object) => ({
        key: object.Key,
        size: object.Size,
        lastModified: object.LastModified,
      })) ?? []

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error('S3 list error:', error)

    const message =
      error instanceof Error ? error.message : 'Unknown S3 error'

    return NextResponse.json(
      { error: message },
      { status: 500 },
    )
  }
}