import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '#/lib/api'
import type { components } from '../types/api'

type Product = components['schemas']['ProductInDB']

export const Route = createFileRoute('/products')({
  component: ProductsPage,
})

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadProducts() {
      try {
        const result = await api.GET('/products')
        if ('error' in result) {
          setError(JSON.stringify(result.error ?? 'Unknown error'))
          return
        }

        if (!active) return

        setProducts(result.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Products</h1>
            <p className="mt-2 text-sm text-slate-600">
              Loaded from the FastAPI backend via `lib/api.ts`.
            </p>
          </div>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back home
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading products...</p>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Error loading products: {error}
          </div>
        ) : products.length === 0 ? (
          <p className="text-slate-600">No products found.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-medium text-slate-900">
                    {product.name}
                  </p>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
