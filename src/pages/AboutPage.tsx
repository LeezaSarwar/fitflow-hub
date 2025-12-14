import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Dumbbell, Users, Target, Award, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'We focus on your personal fitness goals with customized plans and dedicated support.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a supportive community of fitness enthusiasts who motivate and inspire each other.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Our certified trainers bring years of expertise to help you achieve peak performance.',
    },
    {
      icon: Heart,
      title: 'Wellness',
      description: 'We believe in holistic health, combining fitness with nutrition and mental well-being.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Members' },
    { value: '15+', label: 'Expert Trainers' },
    { value: '50+', label: 'Weekly Classes' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">About PowerFit</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-6">
              Transform Your Life With{' '}
              <span className="text-primary">PowerFit</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded with a passion for fitness and well-being, PowerFit is more than just a gym. 
              We're a community dedicated to helping you become the best version of yourself through 
              personalized training, nutrition guidance, and unwavering support.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">
                Our <span className="text-primary">Mission</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At PowerFit, we believe that everyone deserves access to world-class fitness 
                training and nutrition guidance. Our mission is to empower individuals to take 
                control of their health through science-backed workout programs, personalized 
                diet plans, and a supportive community.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you're looking to lose weight, build muscle, or simply maintain a 
                healthy lifestyle, our team of certified trainers and nutritionists are here 
                to guide you every step of the way.
              </p>
              <Button onClick={() => navigate('/auth')} size="lg">
                Start Your Journey
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Dumbbell className="w-16 h-16 text-primary" />
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mt-8">
                <Target className="w-16 h-16 text-primary" />
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                <Heart className="w-16 h-16 text-primary" />
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mt-8">
                <Clock className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at PowerFit, from how we train 
              our members to how we build our community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
                Ready to <span className="text-primary">Transform</span>?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join PowerFit today and get personalized workout and diet plans 
                tailored to your fitness goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/auth')} size="lg">
                  Get Started Free
                </Button>
                <Button variant="outline" onClick={() => navigate('/classes')} size="lg">
                  View Classes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
