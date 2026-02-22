'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { File, Zap, Layers, Tag, Search, Share2 } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <File className="w-6 h-6 text-primary" />
            NotesVerb
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Smart Note Taking
            
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            NotesVerb is a simple and intuitive note-taking app that helps users capture and organize ideas effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Start Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-border px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border bg-background">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Built with modern microservices. Your notes sync instantly across all devices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border bg-background">
              <Tag className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Tags</h3>
              <p className="text-muted-foreground">
                Organize notes with powerful tagging system. Find exactly what you need instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border bg-background">
              <Search className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Full Text Search</h3>
              <p className="text-muted-foreground">
                Search through all your notes with powerful full-text search capabilities.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border bg-background">
              <Layers className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rich Editor</h3>
              <p className="text-muted-foreground">
                Write with a powerful editor that supports formatting and auto-save.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-border bg-background">
              <Share2 className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Share Notes</h3>
              <p className="text-muted-foreground">
                Collaborate with others by sharing your notes easily and securely.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-border bg-background">
              <File className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Auto-Save</h3>
              <p className="text-muted-foreground">
                Never lose work. Your notes are automatically saved as you type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users taking smarter notes with NotesVerb.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2026 NotesVerb</p>
        </div>
      </footer>
    </div>
  );
}
