import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Users, Calendar, Trophy, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Dumbbell className="w-8 h-8" />, title: 'State-of-the-Art Equipment', desc: 'Premium machines and free weights' },
    { icon: <Users className="w-8 h-8" />, title: 'Expert Trainers', desc: 'Certified professionals to guide you' },
    { icon: <Calendar className="w-8 h-8" />, title: 'Flexible Classes', desc: '50+ classes weekly for all levels' },
    { icon: <Trophy className="w-8 h-8" />, title: 'Track Progress', desc: 'Digital tools to monitor your gains' },
  ];

  const plans = [
    { name: 'Monthly', price: 49, features: ['Full gym access', 'Group classes', 'Locker room'] },
    { name: 'Quarterly', price: 129, popular: true, features: ['Everything in Monthly', 'Personal trainer session', 'Diet consultation'] },
    { name: 'Yearly', price: 449, features: ['Everything in Quarterly', 'Unlimited PT sessions', 'Priority booking'] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(24,100%,50%,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              #1 Fitness Center in the City
            </span>
            
            <h1 className="font-display text-6xl md:text-8xl tracking-wider leading-tight">
              TRANSFORM YOUR
              <span className="block gradient-text glow-text">BODY & MIND</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join PowerFit and unlock your true potential. Expert trainers, world-class equipment, and a community that pushes you to be your best.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
                START YOUR JOURNEY
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="xl" onClick={() => navigate('/pricing')}>
                VIEW PRICING
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-muted-foreground">
              <div className="text-center">
                <div className="font-display text-4xl text-foreground">500+</div>
                <div className="text-sm">Active Members</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="font-display text-4xl text-foreground">15+</div>
                <div className="text-sm">Expert Trainers</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="font-display text-4xl text-foreground">50+</div>
                <div className="text-sm">Weekly Classes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-16">
            WHY CHOOSE <span className="text-primary">POWERFIT</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="stat-card text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl tracking-wider mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
            MEMBERSHIP <span className="text-primary">PLANS</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16">Choose the perfect plan for your fitness goals</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`stat-card relative ${plan.popular ? 'border-primary shadow-glow' : ''}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="font-display text-2xl tracking-wider mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="font-display text-5xl">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.name.toLowerCase()}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? 'default' : 'outline'} className="w-full" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-6">
            READY TO <span className="text-primary">TRANSFORM</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start your fitness journey today. First week is on us!
          </p>
          <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
            JOIN NOW - FREE TRIAL
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
