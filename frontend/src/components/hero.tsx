import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from './ui/button'
import { Reveal, Stagger, StaggerItem } from './motion'

const Hero = () => {
  return (
    <section className="relative isolate -mt-16 overflow-hidden pt-16">
      {/* Background: Prep gradient + grid */}
      <div
        aria-hidden
        className="bg-prep-gradient pointer-events-none absolute inset-0 -z-20"
      />

      <div className="container-prep flex flex-col items-center py-20 text-center sm:py-28">
        <Stagger className="max-w-3xl" stagger={0.1}>
          <StaggerItem as="div">
            <h1 className="text-4xl leading-[1.05] font-extrabold text-foreground sm:text-6xl lg:text-7xl">
              Welcome to Prep
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-4 text-lg text-foreground/80 sm:text-xl">
              Your exam mastered
            </p>
          </StaggerItem>

          <StaggerItem className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="xl" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </StaggerItem>
        </Stagger>
      </div>

      {/* Full-width image placeholder (mountain image in the mockup) */}
      <Reveal delay={0.4}>
        <div className="flex h-64 w-full items-center justify-center border-y border-border/60 bg-card/70 sm:h-80 lg:h-[28rem]">
          <p className="text-sm text-muted-foreground">
            Replace with screenshots later
          </p>
        </div>
      </Reveal>
    </section>
  )
}

export default Hero
