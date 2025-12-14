import { Dumbbell, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display text-2xl tracking-wider text-foreground">
                POWER<span className="text-primary">FIT</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Transform your body, transform your life. Join the ultimate fitness experience.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/leeza-sarwar/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/LeezaSarwar" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://x.com/LeezaSarwar?t=GuicOuNUal0TEmJ6UN4FAA&s=09" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://leezaportfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/classes" className="text-muted-foreground hover:text-primary transition-colors">Classes</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Join Now</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">PROGRAMS</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground">Strength Training</span></li>
              <li><span className="text-muted-foreground">HIIT Workouts</span></li>
              <li><span className="text-muted-foreground">Yoga & Flexibility</span></li>
              <li><span className="text-muted-foreground">Personal Training</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">CONTACT</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>123 Fitness Street</li>
              <li>New York, NY 10001</li>
              <li>+1 (555) 123-4567</li>
              <li>info@powerfit.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} PowerFit. All rights reserved.</p>
          <p>Built with love by <a href="https://www.linkedin.com/in/leeza-sarwar/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Leeza Sarwar</a>.</p>
        </div>
      </div>
    </footer>
  );
}
