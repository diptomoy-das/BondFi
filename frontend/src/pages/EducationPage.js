import { Layout } from '../components/Layout';
import { BookOpen, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';

export const EducationPage = () => {
  const articles = [
    {
      id: 1,
      title: 'What Are Government Bonds?',
      description:
        'Government bonds are debt securities issued by governments to raise capital. When you buy a government bond, you are lending money to the government in exchange for periodic interest payments and the return of your principal at maturity.',
      icon: BookOpen,
      color: 'primary',
    },
    {
      id: 2,
      title: 'Understanding Bond Yields',
      description:
        'Yield is the return you earn on a bond investment. Higher yields typically indicate higher risk or longer maturity periods. Government bonds from stable countries offer lower yields but greater security.',
      icon: TrendingUp,
      color: 'secondary',
    },
    {
      id: 3,
      title: 'Why Fractional Investing?',
      description:
        'Fractional investing allows you to purchase a portion of a bond rather than the full amount. This makes high-quality government bonds accessible to students and small investors starting with as little as $1.',
      icon: DollarSign,
      color: 'primary',
    },
    {
      id: 4,
      title: 'Blockchain & Transparency',
      description:
        'All bond transactions are recorded on the Stellar blockchain, providing complete transparency and auditability. You can verify your ownership and track your investments in real-time on a public ledger.',
      icon: ShieldCheck,
      color: 'secondary',
    },
  ];

  const faqs = [
    {
      q: 'How safe are government bonds?',
      a: 'Government bonds are considered one of the safest investments because they are backed by the full faith and credit of the issuing government. Bonds from AAA-rated countries like the US, Germany, and Singapore have extremely low default risk.',
    },
    {
      q: 'What is the minimum investment?',
      a: 'You can start investing with just $1. This makes government bonds accessible to everyone, including students on a budget.',
    },
    {
      q: 'How do I earn returns?',
      a: 'You earn returns through the annual yield (APY) of the bond. For example, a 4% APY bond worth $100 will earn you approximately $4 per year. Returns accrue over time until the bond matures.',
    },
    {
      q: 'Can I sell my bonds before maturity?',
      a: 'Currently, bonds are held until maturity. We are working on a secondary market feature that will allow users to trade bonds before their maturity date.',
    },
    {
      q: 'How is this different from traditional bond investing?',
      a: 'Traditional bond investing requires large minimum investments (often $1,000+). Our platform uses blockchain technology to fractionalize bonds, allowing you to invest any amount starting from $1.',
    },
  ];

  return (
    <Layout>
      <div className="p-6 md:p-8 lg:p-12 space-y-12" data-testid="education-page">
        <div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight">Education Hub</h1>
          <p className="text-muted-foreground mt-2">Learn about bond investing</p>
        </div>

        <div>
          <h2 className="text-2xl font-mono font-semibold mb-6">Key Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => {
              const Icon = article.icon;
              return (
                <div
                  key={article.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  data-testid={`education-card-${article.id}`}
                >
                  <div
                    className={`w-12 h-12 rounded-md ${
                      article.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                    } flex items-center justify-center mb-4`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        article.color === 'primary' ? 'text-primary' : 'text-secondary'
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-mono font-semibold mb-3">{article.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{article.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-mono font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6"
                data-testid={`faq-${index}`}
              >
                <h3 className="text-lg font-mono font-semibold mb-2 text-primary">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8">
          <h3 className="text-2xl font-mono font-bold mb-3">Ready to Start?</h3>
          <p className="text-muted-foreground mb-6">
            Now that you understand the basics, explore the marketplace and start building your bond portfolio.
          </p>
          <div className="flex gap-4">
            <a
              href="/marketplace"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-glow-sm font-mono uppercase tracking-wide text-sm transition-colors"
              data-testid="education-cta-marketplace"
            >
              Browse Bonds
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-input hover:bg-accent rounded-md font-mono uppercase tracking-wide text-sm transition-colors"
              data-testid="education-cta-dashboard"
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
