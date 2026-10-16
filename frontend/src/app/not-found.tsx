import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function NotFound() {
  return (
    <div className='min-h-[80vh] flex-col flex-center'>
      <h1 className={`${inter.className} text-4xl sm:text-8xl font-medium`}>404 Not Found</h1>
      <h3 className={`${inter.className} mt-10`}>Your visited page not found. You may go home page.</h3>
      <Link href="/" className={`${inter.className} button-primary py-4 px-12 mt-20 rounded-md mt-10`}>Back to home page</Link>
    </div>
  )
}
