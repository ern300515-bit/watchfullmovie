// app/privacy-policy/page.js

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = {
  title: 'Privacy Policy - WatchFullMovie',
  description:
    'Learn how WatchFullMovie handles information, cookies, advertising, analytics, and third-party services when you use our movie and TV catalogue.',
  keywords:
    'privacy policy, WatchFullMovie privacy, cookies, data protection, advertising privacy',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        Privacy Policy
      </h1>

      <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
        <div className="space-y-6 text-justify">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Introduction
            </h2>

            <p>
              Welcome to WatchFullMovie. This Privacy Policy explains how
              information may be collected, used, and disclosed when you
              visit or use the WatchFullMovie website.
            </p>

            <p className="mt-3">
              WatchFullMovie is a movie and TV series catalogue and discovery
              website. We help users discover titles and find information
              about where movies and TV series may be available through
              third-party streaming services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Information We May Collect
            </h2>

            <p>
              Depending on how you interact with WatchFullMovie, we may receive
              limited information such as:
            </p>

            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Information you voluntarily provide when contacting us.
              </li>

              <li>
                Technical information associated with your browser or
                device, such as IP address, browser type, operating system,
                approximate location, referring pages, and access times.
              </li>

              <li>
                Usage information about how visitors interact with the
                website, where analytics or similar technologies are enabled.
              </li>

              <li>
                Cookie and advertising-related information where cookies,
                advertising technologies, or similar technologies are used.
              </li>
            </ul>

            <p className="mt-3">
              WatchFullMovie does not require users to create an account simply
              to browse the movie and TV catalogue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. How We Use Information
            </h2>

            <p>
              Information may be used for purposes such as:
            </p>

            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Operating and maintaining the WatchFullMovie website.
              </li>

              <li>
                Improving website functionality, performance, and user
                experience.
              </li>

              <li>
                Understanding website traffic and usage patterns.
              </li>

              <li>
                Responding to questions, feedback, and support requests.
              </li>

              <li>
                Protecting the website against abuse, fraud, spam, and
                security threats.
              </li>

              <li>
                Displaying advertising where advertising services are
                enabled.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Cookies and Similar Technologies
            </h2>

            <p>
              WatchFullMovie and certain third-party services may use cookies,
              local storage, pixels, tags, or similar technologies.
            </p>

            <p className="mt-3">
              These technologies may be used for essential website
              functionality, preferences, analytics, security, or
              advertising purposes.
            </p>

            <p className="mt-3">
              Your browser may allow you to control or block cookies.
              Blocking certain cookies may affect some website features or
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Advertising
            </h2>

            <p>
              WatchFullMovie may display advertisements provided by third-party
              advertising partners.
            </p>

            <p className="mt-3">
              Advertising providers may use cookies or similar technologies
              to deliver, measure, personalize, or limit advertisements,
              subject to their own privacy policies and applicable laws.
            </p>

            <p className="mt-3">
              WatchFullMovie does not control the privacy practices of
              independent advertising providers. Users should review the
              applicable third-party privacy policies for additional
              information about their practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Third-Party Services and Streaming Providers
            </h2>

            <p>
              WatchFullMovie may use third-party services to provide movie and
              TV metadata, search functionality, analytics, advertising,
              infrastructure, or other website features.
            </p>

            <p className="mt-3">
              WatchFullMovie may also link to third-party streaming providers.
              When you leave WatchFullMovie and visit a third-party website or
              service, that service&apos;s own terms and privacy policy apply.
            </p>

            <p className="mt-3">
              WatchFullMovie does not control how third-party services collect,
              use, store, or process information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Movie and TV Metadata
            </h2>

            <p>
              WatchFullMovie may display movie and TV series information obtained
              from third-party data providers. Such information may include
              titles, descriptions, release dates, genres, cast information,
              images, ratings, and streaming availability.
            </p>

            <p className="mt-3">
              This information is used to provide catalogue and discovery
              functionality and does not necessarily represent content
              hosted by WatchFullMovie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. External Links
            </h2>

            <p>
              WatchFullMovie may contain links to websites operated by third
              parties. We are not responsible for the content, security,
              privacy practices, or policies of external websites.
            </p>

            <p className="mt-3">
              We recommend reviewing the privacy policy of any third-party
              website before providing personal information or using its
              services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Data Security
            </h2>

            <p>
              We take reasonable measures to help protect information
              handled through the website. However, no method of transmission
              or electronic storage is completely secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Data Retention
            </h2>

            <p>
              Information is retained only for as long as reasonably
              necessary for the purposes described in this Privacy Policy,
              to maintain website operations, resolve disputes, comply with
              legal obligations, or protect our rights and users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              11. Your Privacy Rights
            </h2>

            <p>
              Depending on your location and applicable law, you may have
              rights regarding your personal information, including rights
              to access, correct, delete, restrict, or object to certain
              processing.
            </p>

            <p className="mt-3">
              To make a privacy-related request, please contact us through
              our{' '}
              <a
                href="/contact"
                className="text-blue-400 hover:underline"
              >
                Contact page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              12. Children&apos;s Privacy
            </h2>

            <p>
              WatchFullMovie is a general-audience website and does not
              knowingly request personal information from children for the
              purpose of creating user accounts.
            </p>

            <p className="mt-3">
              If you believe that a child has provided personal information
              to us, please contact us so that we can review the situation
              and take appropriate action where required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              13. Changes to This Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time to reflect
              changes to our website, services, technologies, or legal
              requirements.
            </p>

            <p className="mt-3">
              When changes are made, the updated version will be published
              on this page together with a revised &quot;Last Updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              14. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy or wish to
              submit a privacy-related request, please use our{' '}
              <a
                href="/contact"
                className="text-blue-400 hover:underline"
              >
                Contact page
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-gray-400 mt-8 text-justify">
            Last Updated: September 5, 2026
          </p>

        </div>
      </div>
    </div>
  );
}