'use client';
import Navbar from '@/components/ui/navbar';

export default function About() {
  return (
    <main className="flex h-screen flex-col bg-white">
      <Navbar
        activePage="Text & CSV To Map"
      />

      <div className="flex justify-center p-2 py-5 pt-10">
        <div className="flex flex-col w-1/2 justify-between">
            <h1 className="text-5xl font-bold text-primary mb-5 px-6">
                Text & CSV To Map<br />
            </h1>
          <div className="w-100 p-6 card">
            <p className="text-lg text-secondary">
                In addition to this service, we have develioped blabla text map okay.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center p-2 py-5">
        <div className="flex flex-col w-1/2 justify-between">
            <h2 className="text-3xl font-bold text-primary mb-5 px-6">
                A subheading<br />
            </h2>
          <div className="w-100 p-6 card">
            <p className="text-lg text-secondary">
                Curabitur id posuere ante, eu dapibus dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque quam quam, molestie eget ante non, fringilla pharetra enim. Donec id turpis ac dolor tempus scelerisque. Pellentesque venenatis metus vitae tellus gravida, laoreet imperdiet orci euismod. Sed nunc eros, hendrerit eget rhoncus a, mattis non ligula. In hac habitasse platea dictumst. Curabitur elementum dictum mi, sit amet iaculis odio semper a. Quisque neque lacus, faucibus nec tempor sed, venenatis quis mi. Aenean consectetur a ligula sit amet laoreet. Pellentesque a suscipit orci. Vestibulum cursus id nulla non pretium. Etiam posuere elit eget feugiat volutpat. Duis nec interdum turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center p-2 py-5">
        <div className="flex flex-col w-1/2 justify-between">
            <h2 className="text-3xl font-bold text-primary mb-5 px-6">
                A subheading<br />
            </h2>
          <div className="w-100 p-6 card">
            <p className="text-lg text-secondary">
                Ut suscipit lorem vel sodales sodales. Vivamus dapibus at odio vel finibus. Curabitur non tempor orci. In fermentum purus at odio malesuada, at lobortis mauris ullamcorper. Donec varius sit amet ligula at sollicitudin. Nam auctor dolor in eros aliquet, sit amet condimentum nulla consequat. Praesent rutrum turpis nisl, ac vulputate erat congue quis. Maecenas placerat convallis nunc, quis aliquam diam blandit nec. Proin lobortis at urna quis dignissim. Curabitur at quam est. Nullam augue ligula, ultrices elementum lectus eget, tincidunt euismod enim. Donec pretium, tortor sed feugiat luctus, orci tortor imperdiet felis, vel faucibus velit arcu ac neque.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}