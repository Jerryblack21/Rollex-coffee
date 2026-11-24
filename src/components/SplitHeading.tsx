import { ElementType } from 'react';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
}

/** Heading split into words for the staggered reveal (see useSectionAnimations). Screen readers get the plain text. */
export default function SplitHeading({ text, as: Tag = 'h2', className = '' }: Props) {
  const words = text.split(' ');
  return (
    <Tag data-words aria-label={text} className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <span className="word-inner inline-block will-change-transform">{w}</span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
