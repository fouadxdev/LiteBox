import { Link } from "react-router-dom";
import { FolderOpen, Upload, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Upload,
    title: "Upload & organize",
    description:
      "Drag and drop or click to upload. Keep everything in folders that make sense for you.",
  },
  {
    icon: Share2,
    title: "Share with a link",
    description:
      "Generate shareable links with optional expiration. View-only access, no sign-in required.",
  },
  {
    icon: Shield,
    title: "Safe in the cloud",
    description:
      "Files stored securely with Cloudinary. Your data, your control.",
  },
];

export default function Landing() {
  return (
    <div
      className="landing min-h-screen"
      style={{
        background: "var(--landing-bg)",
        fontFamily: "var(--landing-font-body)",
      }}
    >
      {/* Background atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: "var(--landing-bg-mesh)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <header className="relative z-10 border-b border-stone-200/80 dark:border-stone-700/50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-md transition-colors duration-200"
            style={{ fontFamily: "var(--landing-font-heading)" }}
            aria-label="LiteBox home"
          >
            <FolderOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" aria-hidden />
            <span>LiteBox</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-md py-2 px-3"
            >
              Sign in
            </Link>
            <Link to="/signup" className="cursor-pointer" aria-label="Sign up">
              <Button
                className="rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white border-0 transition-colors duration-200 focus-visible:ring-teal-500"
                size="sm"
              >
                Get started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 mb-6"
            style={{
              fontFamily: "var(--landing-font-heading)",
              lineHeight: 1.15,
            }}
            data-animate
          >
            Your files,{" "}
            <span className="text-teal-600 dark:text-teal-400">organized</span>.
          </h1>
          <p
            className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-10"
            style={{ lineHeight: 1.6 }}
            data-animate
          >
            Store, share, and find everything in one place. Simple cloud storage
            without the clutter.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            data-animate
          >
            <Link to="/signup" className="cursor-pointer w-full sm:w-auto" aria-label="Create account">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white text-base font-medium h-12 px-8 transition-all duration-200 focus-visible:ring-teal-500 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/30"
              >
                Create free account
              </Button>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto cursor-pointer rounded-xl border border-stone-300 dark:border-stone-600 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium h-12 px-8 inline-flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Hero visual: abstract stack */}
        <div
          className="mt-16 sm:mt-20 flex justify-center gap-2 sm:gap-3"
          data-animate
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border transition-transform duration-300 hover:scale-105 cursor-default",
                "bg-white/90 dark:bg-stone-800/90 border-stone-200 dark:border-stone-600 shadow-lg"
              )}
              style={{
                width: 72 + i * 24,
                height: 88 + i * 16,
                transform: `rotate(${-4 + i * 4}deg) translateY(${i * 4}px)`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-50 text-center mb-4"
            style={{ fontFamily: "var(--landing-font-heading)" }}
            data-animate
          >
            Everything you need
          </h2>
          <p
            className="text-stone-600 dark:text-stone-400 text-center max-w-xl mx-auto mb-14"
            style={{ lineHeight: 1.6 }}
            data-animate
          >
            Upload, organize, and share with a few clicks.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={cn(
                  "rounded-2xl border border-stone-200/80 dark:border-stone-700/50 p-6 sm:p-8",
                  "bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm",
                  "transition-all duration-200 hover:shadow-xl hover:shadow-stone-200/20 dark:hover:shadow-stone-900/40 hover:border-teal-200 dark:hover:border-teal-800/50 cursor-default"
                )}
                style={{
                  animation: "landingFadeUp 0.6s ease-out both",
                  animationDelay: `${0.1 * (i + 1)}s`,
                }}
                data-animate
              >
                <div
                  className="w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center mb-5 text-teal-600 dark:text-teal-400"
                  aria-hidden
                >
                  <feature.icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3
                  className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2"
                  style={{ fontFamily: "var(--landing-font-heading)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-stone-600 dark:text-stone-400 text-[15px]"
                  style={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative py-16 sm:py-20 px-4" data-animate>
        <div className="max-w-3xl mx-auto text-center rounded-2xl border border-stone-200/80 dark:border-stone-700/50 bg-stone-100/80 dark:bg-stone-800/40 backdrop-blur-sm p-8 sm:p-10">
          <h2
            className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-50 mb-3"
            style={{ fontFamily: "var(--landing-font-heading)" }}
          >
            Ready to get started?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            Create an account and upload your first file in under a minute.
          </p>
          <Link to="/signup" className="cursor-pointer inline-block" aria-label="Sign up for LiteBox">
            <Button
              size="lg"
              className="rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white font-medium h-12 px-8 transition-colors duration-200 focus-visible:ring-teal-500"
            >
              Sign up free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-stone-200/80 dark:border-stone-700/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-stone-600 dark:text-stone-400 font-medium cursor-pointer hover:text-stone-900 dark:hover:text-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md"
            style={{ fontFamily: "var(--landing-font-heading)" }}
            aria-label="LiteBox home"
          >
            <FolderOpen className="w-5 h-5 text-teal-500" aria-hidden />
            LiteBox
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md py-1"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md py-1"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </footer>

      <style>{`
        @keyframes landingFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        [data-animate] {
          animation: landingFadeUp 0.6s ease-out both;
        }
        .landing section [data-animate]:nth-child(1) { animation-delay: 0.05s; }
        .landing section [data-animate]:nth-child(2) { animation-delay: 0.1s; }
        .landing section [data-animate]:nth-child(3) { animation-delay: 0.15s; }
        .landing section [data-animate]:nth-child(4) { animation-delay: 0.2s; }
        .landing section [data-animate]:nth-child(5) { animation-delay: 0.25s; }
        .landing section [data-animate]:nth-child(6) { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
