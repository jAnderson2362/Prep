import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Package } from 'lucide-react'

import { api } from '#/lib/api'
import type { components } from '../types/api'
import { Reveal, Stagger, StaggerItem } from '#/components/motion'
import { PageHeader, PageShell } from '#/components/page-shell'
import { Alert } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'

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
    <PageShell tone="hero">
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Loaded from the FastAPI backend via the typed API client."
        actions={
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft />
              Back home
            </Link>
          </Button>
        }
      />

      {loading ? (
        <Reveal className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading products...
        </Reveal>
      ) : error ? (
        <Reveal>
          <Alert variant="danger">Error loading products: {error}</Alert>
        </Reveal>
      ) : products.length === 0 ? (
        <Reveal>
          <Card variant="outline" className="items-center py-14 text-center">
            <CardContent>
              <Package className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">No products found.</p>
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
          {products.map((product) => (
            <StaggerItem as="li" key={product.id}>
              <Card interactive padding="sm" className="h-full">
                <CardContent className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{product.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    ${product.price.toFixed(2)}
                  </Badge>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </PageShell>
  )
}
