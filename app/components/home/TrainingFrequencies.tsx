import { Container } from '~/components/common/Container';
import { SectionHeader } from '~/components/common/SectionHeader';
import { HOME_TRAINING_FREQUENCIES } from '~/content/home';

const { eyebrow, heading, description, playlist } = HOME_TRAINING_FREQUENCIES;

/**
 * "Training Frequencies" — centered Spotify playlist embed directly below
 * What We Stand For. The one iframe in the app: Spotify's embed is the only
 * unauthenticated way to surface a playable playlist.
 */
export const TrainingFrequencies = () => (
  <Container className="py-9 text-center md:py-12">
    <p className="text-support font-mono text-xs tracking-spec uppercase">{eyebrow}</p>
    <SectionHeader heading={heading} align="center" scale="section" className="mt-2 mb-0" />
    {/* Rendered outside SectionHeader's subtitle slot: its xl:text-[1.1rem]
        bump reads too large under this centered lockup, so the description
        holds the pre-xl 12px at every width. */}
    <p className="text-support mt-2 text-xs">{description}</p>
    <iframe
      title={playlist.title}
      src={playlist.src}
      width="100%"
      height={playlist.height}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="mx-auto mt-8 block w-full max-w-3xl rounded-xl"
    />
  </Container>
);
