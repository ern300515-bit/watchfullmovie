// app/dmca/page.js

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = {
  title: 'DMCA Policy - WatchFullMovie',
  description:
    'WatchFullMovie DMCA and copyright policy for reporting alleged copyright infringement and intellectual property concerns.',
  keywords:
    'DMCA, copyright policy, copyright infringement, WatchFullMovie DMCA, intellectual property',
};

export default function DMCA() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        DMCA Copyright Policy
      </h1>

      <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
        <div className="space-y-6 text-justify">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Copyright and Intellectual Property
            </h2>

            <p>
              WatchFullMovie respects the intellectual property rights of
              copyright owners and expects users of our website to do the
              same. We take copyright concerns seriously and will review
              valid notices of alleged copyright infringement in accordance
              with applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. What WatchFullMovie Provides
            </h2>

            <p>
              WatchFullMovie is a movie and TV series catalogue and discovery
              website. We provide information such as titles, descriptions,
              release information, images, cast information, genres, and
              streaming availability information.
            </p>

            <p className="mt-3">
              WatchFullMovie does not host, upload, store, or distribute
              copyrighted movies or TV episodes for streaming or download
              on its own servers. Where applicable, WatchFullMovie directs users
              to third-party streaming services and other external websites
              where availability information can be checked.
            </p>

            <p className="mt-3">
              The availability of a title on a third-party service is
              determined by that service and may vary by country, region,
              subscription, advertising-supported availability, rental,
              purchase, or other licensing conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Reporting Copyright Concerns
            </h2>

            <p>
              If you are a copyright owner or are authorized to act on behalf
              of a copyright owner, and you believe that material displayed
              on or through WatchFullMovie infringes your copyright, please
              contact us through our{' '}
              <a
                href="/contact"
                className="text-blue-400 hover:underline"
              >
                Contact page
              </a>
              .
            </p>

            <p className="mt-3">
              To help us review your request efficiently, please provide
              sufficient information to identify the copyrighted work and
              the specific material or page that you believe is infringing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Information to Include in a Copyright Notice
            </h2>

            <div className="bg-slate-700 p-4 rounded mt-3">
              <p>
                A copyright complaint should, where applicable, include:
              </p>

              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>
                  Identification of the copyrighted work that you claim has
                  been infringed.
                </li>

                <li>
                  Identification of the specific WatchFullMovie page, material,
                  or content that you believe is infringing, including its
                  URL or sufficient information for us to locate it.
                </li>

                <li>
                  Your name and contact information so that we can respond
                  to your request.
                </li>

                <li>
                  A statement that you have a good-faith belief that the
                  disputed use is not authorized by the copyright owner,
                  its agent, or applicable law.
                </li>

                <li>
                  A statement that the information provided in your notice
                  is accurate and, where required, that you are authorized
                  to act on behalf of the copyright owner.
                </li>

                <li>
                  Your physical or electronic signature, where required.
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Third-Party Streaming Services
            </h2>

            <p>
              WatchFullMovie may display information about third-party streaming
              providers and may provide links or directions to their
              websites or services.
            </p>

            <p className="mt-3">
              WatchFullMovie does not control the content, licensing, copyright
              status, availability, or policies of third-party services.
              Copyright complaints concerning content hosted or provided by
              a third-party streaming service should also be directed to the
              relevant service or copyright holder&apos;s designated agent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Review of Notices
            </h2>

            <p>
              We may review copyright notices for completeness and
              applicability. Where appropriate and legally required, we may
              take action regarding material or information displayed on
              WatchFullMovie.
            </p>

            <p className="mt-3">
              Because WatchFullMovie does not host copyrighted video files,
              certain complaints may need to be directed to the third-party
              service that actually hosts or distributes the material.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Counter-Notices
            </h2>

            <p>
              If material or information is removed or access to it is
              restricted as a result of a copyright complaint, a person who
              believes the action was taken in error may contact us through
              the Contact page with information explaining the basis of the
              dispute.
            </p>

            <p className="mt-3">
              Any formal counter-notice process will be handled in
              accordance with applicable copyright law and the circumstances
              of the specific complaint.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Good-Faith Requests
            </h2>

            <p>
              Please do not submit knowingly false or misleading copyright
              claims. We reserve the right to consider the validity and
              completeness of notices before taking action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Contact
            </h2>

            <p>
              For copyright and intellectual property concerns, please use
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

          <p className="text-sm text-gray-400 mt-8 text-justify">
            Last Updated: September 5, 2026
          </p>

          <p className="text-sm text-gray-400 text-justify">
            This policy is provided for general informational purposes and
            does not constitute legal advice.
          </p>

        </div>
      </div>
    </div>
  );
}