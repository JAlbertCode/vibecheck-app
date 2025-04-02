// This page is no longer used - FrogDetails modal component is used instead
// Redirect to pond page
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function FrogRedirect() {
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      router.replace(`/pond?compare=${id}`)
    } else {
      router.replace('/pond')
    }
  }, [id, router])

  return null
}
