import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b',
          borderRadius: '22%',
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#dc2626',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          A
        </div>
      </div>
    ),
    size
  )
}
