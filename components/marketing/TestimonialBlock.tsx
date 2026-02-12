'use client';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

interface TestimonialBlockProps {
  testimonials: Testimonial[];
}

export function TestimonialBlock({ testimonials }: TestimonialBlockProps) {
  return (
    <section className="section-padding bg-flocken-sand">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-flocken-brown">
            Vad hundägare säger
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-card">
              <blockquote>
                <p className="text-lg text-flocken-brown mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <footer className="text-flocken-gray text-sm">
                  <div className="font-semibold text-flocken-brown">{testimonial.author}</div>
                  <div>{testimonial.role}</div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

