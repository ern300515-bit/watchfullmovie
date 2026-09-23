// app/contact/page.jsx

import ContactForm from './ContactForm';

// Static page configuration
export const dynamic = 'force-static';
export const revalidate = false;

// Metadata
export const metadata = {
  title: 'Contact Us - WatchFullMovie',
  description:
    'Contact WatchFullMovie with questions, feedback, technical issues, copyright concerns, or business inquiries.',
  keywords:
    'Contact WatchFullMovie, WatchFullMovie support, movie website support, TV series support, feedback, copyright inquiry',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        Contact Us
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Contact Information */}
        <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
          <h2 className="text-xl font-semibold text-white mb-4">
            Get In Touch
          </h2>

          <p className="mb-6 text-justify">
            We&apos;d love to hear from you. If you have a question,
            suggestion, technical issue, copyright concern, or feedback
            about WatchFullMovie, please contact us using the information
            below or send a message through the contact form.
          </p>

          <div className="space-y-5 text-justify">

            <div>
              <h3 className="font-semibold text-white mb-1">
                General Inquiries
              </h3>
              <p>
                <a
                  href="mailto:ern300515@gmail.com"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  ern300515@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-1">
                Technical Support
              </h3>
              <p>
                <a
                  href="mailto:ern300515@gmail.com"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  ern300515@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-1">
                Copyright &amp; DMCA
              </h3>
              <p>
                For copyright-related concerns or DMCA notices, please
                email{' '}
                <a
                  href="mailto:ern300515@gmail.com"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  ern300515@gmail.com
                </a>{' '}
                and include the relevant details. You can also review
                our{' '}
                <a
                  href="/dmca"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  DMCA Policy
                </a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-1">
                Business Inquiries
              </h3>
              <p>
                <a
                  href="mailto:ern300515@gmail.com"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  ern300515@gmail.com
                </a>
              </p>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 text-justify">
            <h3 className="font-semibold text-white mb-2">
              Response Time
            </h3>

            <p>
              We aim to review and respond to legitimate inquiries as
              soon as reasonably possible. Response times may vary
              depending on the nature and volume of requests.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm />

      </div>

      {/* FAQ */}
      <div className="mt-8 bg-slate-800 p-6 rounded-lg text-gray-300">
        <h2 className="text-xl font-semibold text-white mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-5 text-justify">

          <div>
            <h3 className="font-semibold text-white mb-1">
              How do I report a technical issue?
            </h3>

            <p>
              Use the contact form above or email{' '}
              <a
                href="mailto:ern300515@gmail.com"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                ern300515@gmail.com
              </a>{' '}
              and describe the problem, including the affected page
              or URL when possible.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">
              How do I report a copyright concern?
            </h3>

            <p>
              Please review our{' '}
              <a
                href="/dmca"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                DMCA Policy
              </a>{' '}
              and send the required information to{' '}
              <a
                href="mailto:ern300515@gmail.com"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                ern300515@gmail.com
              </a>.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">
              Does WatchFullMovie host movies or TV episodes?
            </h3>

            <p>
              WatchFullMovie is a movie and TV series catalogue and
              discovery platform. We do not host full copyrighted
              movies or TV episodes on our own servers. Where available,
              WatchFullMovie may provide information or links to third-party
              services where titles can be legally watched.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-1">
              How long does it take to receive a response?
            </h3>

            <p>
              Response times vary depending on the type and volume of
              inquiries. We aim to review legitimate requests as soon
              as reasonably possible.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
