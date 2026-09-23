// app/terms-of-service/page.js

// Static page configuration
export const dynamic = 'force-static';
export const revalidate = false;

// Metadata
export const metadata = {
  title: 'Terms of Service - WatchFullMovie',
  description:
    'Read the Terms of Service for using WatchFullMovie, a movie and TV series catalogue and discovery platform.',
  keywords:
    'WatchFullMovie Terms of Service, terms and conditions, user agreement, movie catalogue terms, TV series catalogue terms',
};

// Main Component
export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        Terms of Service
      </h1>

      <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
        <div className="space-y-6 text-justify">

          {/* 1. Acceptance */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using WatchFullMovie, you agree to be bound by these
              Terms of Service and our Privacy Policy. If you do not agree with
              these terms, please do not use the WatchFullMovie website.
            </p>
          </section>

          {/* 2. About WatchFullMovie */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. About WatchFullMovie
            </h2>

            <p className="mb-3">
              WatchFullMovie is a movie and TV series catalogue and discovery
              platform. We provide information about movies, TV shows, cast,
              genres, release dates, ratings, and related entertainment
              content.
            </p>

            <p>
              WatchFullMovie may also provide information about where movies or TV
              shows may be legally available to watch through third-party
              streaming, rental, purchase, or free-with-ads services, depending
              on availability in the selected region.
            </p>
          </section>

          {/* 3. No Video Hosting */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Video Hosting and Streaming
            </h2>

            <p className="mb-3">
              WatchFullMovie does not operate as a video hosting service and does
              not host, upload, or store full copyrighted movies or TV episodes
              on its own servers for users to stream or download.
            </p>

            <p>
              When WatchFullMovie provides a link or availability information for
              a third-party streaming service, the actual viewing experience,
              content availability, subscription requirements, advertising,
              geographic restrictions, and licensing terms are controlled by
              that third-party service.
            </p>
          </section>

          {/* 4. Third-Party Data and Services */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Third-Party Data and Services
            </h2>

            <p className="mb-3">
              WatchFullMovie uses information from third-party data and service
              providers to help provide movie and TV series catalogue
              information.
            </p>

            <p className="mb-3">
              Some movie and TV metadata may be provided through the TMDB API
              and other third-party sources. WatchFullMovie does not claim ownership
              of third-party trademarks, names, logos, artwork, or other
              intellectual property belonging to their respective owners.
            </p>

            <p>
              Third-party services may have their own terms of service, privacy
              policies, licensing conditions, and availability restrictions.
              You are responsible for reviewing and complying with those terms
              when accessing third-party services through links from
              WatchFullMovie.
            </p>
          </section>

          {/* 5. Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Intellectual Property
            </h2>

            <p className="mb-3">
              The WatchFullMovie website, including its original design, layout,
              software, text, features, and functionality, is protected by
              applicable intellectual property laws.
            </p>

            <p>
              Movie titles, TV show titles, character names, trademarks,
              posters, artwork, logos, and other materials belonging to
              third parties remain the property of their respective owners.
              Their appearance on WatchFullMovie does not imply ownership or
              endorsement by WatchFullMovie.
            </p>
          </section>

          {/* 6. Acceptable Use */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Acceptable Use
            </h2>

            <p className="mb-2">
              You agree to use WatchFullMovie only for lawful purposes and in a
              manner that does not interfere with the operation or security of
              the website.
            </p>

            <p>You agree not to:</p>

            <ul className="list-disc pl-6 mt-2 space-y-1 text-justify">
              <li>
                Use WatchFullMovie for any unlawful or fraudulent purpose.
              </li>

              <li>
                Attempt to gain unauthorized access to WatchFullMovie systems,
                servers, APIs, or infrastructure.
              </li>

              <li>
                Interfere with or disrupt the normal operation of the website.
              </li>

              <li>
                Use automated methods to excessively scrape, crawl, or abuse
                WatchFullMovie resources.
              </li>

              <li>
                Circumvent security, access controls, or technical limitations.
              </li>

              <li>
                Use WatchFullMovie to facilitate copyright infringement or other
                unlawful activity.
              </li>
            </ul>
          </section>

          {/* 7. External Links */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Third-Party Links
            </h2>

            <p>
              WatchFullMovie may contain links to external websites and services,
              including legal streaming, rental, purchase, or advertising
              platforms. These websites are operated independently from
              WatchFullMovie.
            </p>

            <p className="mt-3">
              WatchFullMovie does not control and is not responsible for the
              availability, content, policies, security, pricing, advertising,
              or practices of third-party websites. Your use of those websites
              is subject to their respective terms and policies.
            </p>
          </section>

          {/* 8. Availability and Accuracy */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Information Accuracy and Availability
            </h2>

            <p className="mb-3">
              WatchFullMovie makes reasonable efforts to provide useful and
              up-to-date catalogue information. However, movie and TV metadata,
              ratings, release dates, availability, streaming providers, and
              regional licensing information may change over time.
            </p>

            <p>
              We do not guarantee that all information displayed on WatchFullMovie
              will always be complete, accurate, current, or available in every
              country or region.
            </p>
          </section>

          {/* 9. Free and Legal Viewing */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Free and Legal Viewing Availability
            </h2>

            <p className="mb-3">
              When WatchFullMovie identifies a movie or TV show as available for
              free viewing, free-with-ads viewing, or another viewing option,
              such availability is based on information available from
              third-party sources and may vary by region and time.
            </p>

            <p>
              WatchFullMovie does not guarantee that a title will remain free,
              available, or accessible through a particular provider. Always
              check the third-party provider for the current availability and
              applicable terms.
            </p>
          </section>

          {/* 10. Disclaimer */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Disclaimer
            </h2>

            <p>
              WatchFullMovie is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. To the extent permitted by applicable
              law, WatchFullMovie makes no warranties regarding uninterrupted
              availability, completeness, accuracy, reliability, or suitability
              of the website or its information for a particular purpose.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              11. Limitation of Liability
            </h2>

            <p>
              To the maximum extent permitted by applicable law, WatchFullMovie
              shall not be liable for indirect, incidental, special,
              consequential, or punitive damages arising from or related to
              your use of the website, information displayed on the website,
              or your interaction with third-party websites or services linked
              from WatchFullMovie.
            </p>
          </section>

          {/* 12. Changes */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              12. Changes to These Terms
            </h2>

            <p>
              We may update these Terms of Service from time to time to reflect
              changes to WatchFullMovie, applicable requirements, or our services.
              When changes are made, the updated version will be published on
              this page with a revised effective date.
            </p>

            <p className="mt-3">
              Your continued use of WatchFullMovie after updated terms are
              published constitutes acceptance of the revised terms to the
              extent permitted by applicable law.
            </p>
          </section>

          {/* 13. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              13. Contact Information
            </h2>

            <p>
              If you have questions, concerns, or legal inquiries regarding
              these Terms of Service, please visit our{' '}
              <a
                href="/contact"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Contact page
              </a>
              .
            </p>
          </section>

          {/* Effective Date */}
          <p className="text-sm text-gray-400 mt-8 text-justify">
            Effective Date: September 5, 2026
          </p>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-justify">
            These Terms of Service are provided for general informational
            purposes and are not legal advice. Consider obtaining professional
            legal advice to ensure these terms meet the laws and requirements
            applicable to your business and jurisdiction.
          </p>

        </div>
      </div>
    </div>
  );
}