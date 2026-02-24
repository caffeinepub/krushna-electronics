import { Target, Eye, Zap, Users, Award, TrendingUp } from 'lucide-react';

const milestones = [
  { year: '2010', title: 'Founded', desc: 'Krushna Electronics opened its first store in Pune, Maharashtra.' },
  { year: '2013', title: 'Expansion', desc: 'Expanded to 3 locations across Pune with 500+ products.' },
  { year: '2017', title: 'Online Launch', desc: 'Launched our e-commerce platform serving customers pan-India.' },
  { year: '2020', title: '10K+ Customers', desc: 'Crossed 10,000 happy customers milestone.' },
  { year: '2023', title: 'Premium Partner', desc: 'Became an authorized premium partner for Apple, Samsung & Dell.' },
  { year: '2026', title: 'Today', desc: 'Serving 50,000+ customers with 1,000+ products across all categories.' },
];

const stats = [
  { icon: Users, value: '50,000+', label: 'Happy Customers' },
  { icon: Award, value: '15+', label: 'Years of Service' },
  { icon: TrendingUp, value: '1,000+', label: 'Products' },
  { icon: Zap, value: '99%', label: 'Satisfaction Rate' },
];

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium mb-4">
            <Zap size={14} />
            About Us
          </div>
          <h1 className="font-brand text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Powering Your <span className="text-neon-cyan">Digital Life</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Since 2010, Krushna Electronics has been Pune's most trusted destination for premium
            electronics. We bring you the latest technology at the best prices, backed by expert
            support and genuine products.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-neon-cyan/40 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-3">
                <stat.icon size={20} className="text-neon-cyan" />
              </div>
              <p className="font-brand text-2xl font-bold text-neon-cyan">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-card border border-border rounded-xl p-8 hover:border-neon-cyan/40 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                <Target size={20} className="text-neon-cyan" />
              </div>
              <h2 className="font-brand text-2xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To make premium technology accessible to everyone in India by offering genuine
              products at competitive prices, backed by exceptional customer service and expert
              technical support. We believe every person deserves access to the best technology
              without compromise.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 hover:border-neon-cyan/40 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                <Eye size={20} className="text-neon-cyan" />
              </div>
              <h2 className="font-brand text-2xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become India's most trusted electronics retailer, known for our integrity,
              expertise, and commitment to customer satisfaction. We envision a future where
              cutting-edge technology empowers every household and business across the nation.
            </p>
          </div>
        </div>

        {/* Store Introduction */}
        <div className="bg-card border border-border rounded-xl p-8 mb-16">
          <h2 className="font-brand text-2xl font-bold text-foreground mb-4">
            Our <span className="text-neon-cyan">Story</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground leading-relaxed">
            <p>
              Krushna Electronics was founded in 2010 by Krushna Patil in the heart of Pune's
              electronics market on MG Road. What started as a small shop with a handful of
              mobile phones has grown into one of Maharashtra's most respected electronics
              retailers.
            </p>
            <p>
              We pride ourselves on stocking only genuine, warranty-backed products from the
              world's leading brands including Apple, Samsung, Dell, Lenovo, and more. Our team
              of certified technicians and sales experts are always ready to help you find the
              perfect device for your needs and budget.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="font-brand text-2xl font-bold text-foreground mb-8 text-center">
            Our <span className="text-neon-cyan">Journey</span>
          </h2>
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`flex items-center gap-6 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      i % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    <div className="bg-card border border-border rounded-xl p-5 hover:border-neon-cyan/40 transition-all inline-block w-full md:max-w-xs">
                      <p className="text-neon-cyan font-brand font-bold text-lg">{m.year}</p>
                      <p className="font-semibold text-foreground">{m.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-neon-cyan border-2 border-background shrink-0 z-10 neon-glow" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
